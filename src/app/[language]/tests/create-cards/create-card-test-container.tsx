"use client";
import { useState } from 'react';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { vendorConfig, productConfig } from '@/components/cards/create-cards/configs';
import { FormData } from '@/components/cards/shared/types';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";

export default function CreateCardTestContainer() {
  const { t } = useTranslation("tests");
  const { enqueueSnackbar } = useSnackbar();
  const [createType, setCreateType] = useState<'vendor' | 'product'>('vendor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormData>({});

  const handleSave = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Creating:', data);
      setCurrentFormData(data);
      enqueueSnackbar(t('success.created'), { variant: 'success' });
    } catch (error) {
      console.error('Error creating:', error);
      enqueueSnackbar(t('errors.createFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentFormData({});
    enqueueSnackbar(t('canceled'), { variant: 'success' });
  };

  const handleFormChange = (data: FormData) => {
    setCurrentFormData(data);
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: 'vendor' | 'product' | null) => {
    if (value) {
      setCreateType(value);
      setCurrentFormData(value === 'vendor' ? mockVendorData : mockProductData);
    }
  };


  const mockVendorData = {
    businessName: '',
    description: '',
    vendorType: '',
    email: '',
    phone: '',
    website: '',
    logoUrl: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  };

  const mockProductData = {
    productName: '',
    productDescription: '',
    productType: '',
    productPrice: '',
    productDuration: '',
    productDate: '',
    productStartTime: '',
    productImageURL: ''
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('createCardTest')}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {t('createCardTestDescription')}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <ToggleButtonGroup
          value={createType}
          exclusive
          onChange={handleTypeChange}
          aria-label="create type"
          fullWidth
        >
          <ToggleButton value="vendor" aria-label="vendor">
            {t('vendor')}
          </ToggleButton>
          <ToggleButton value="product" aria-label="product">
            {t('product')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <CreateCard
        config={createType === 'vendor' ? vendorConfig : productConfig}
        initialData={currentFormData}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        onChange={handleFormChange}
      />

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('console')}
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            backgroundColor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            overflow: 'auto'
          }}
        >
          {JSON.stringify(currentFormData, null, 2)}
        </Box>
      </Paper>
    </Container>
  );
}