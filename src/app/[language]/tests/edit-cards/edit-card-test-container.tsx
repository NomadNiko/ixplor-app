"use client";
import { useState } from 'react';
import { EditCard } from '@/components/edit-cards/EditCard';
import { vendorConfig, productConfig } from '@/components/edit-cards/configs';
import { FormData } from '@/components/edit-cards/types';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";

export default function EditCardTestContainer() {
  const { t } = useTranslation("tests");
  const { enqueueSnackbar } = useSnackbar();
  const [editType, setEditType] = useState<'vendor' | 'product'>('vendor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving data:', data);
      enqueueSnackbar(t('success.saved'), { variant: 'success' });
    } catch (error) {
      console.error('Error saving:', error);
      enqueueSnackbar(t('errors.saveFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    enqueueSnackbar(t('canceled'), { variant: 'error' });
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleted');
      enqueueSnackbar(t('success.deleted'), { variant: 'success' });
    } catch (error) {
      console.error('Error deleting:', error);
      enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockVendorData = {
    businessName: 'Test Business',
    description: 'A test business description',
    vendorType: 'tours',
    email: 'test@example.com',
    phone: '123-456-7890',
    website: 'https://example.com',
    logoUrl: 'https://example.com/logo.png',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    postalCode: '12345'
  };

  const mockProductData = {
    productName: 'Test Product',
    productDescription: 'A test product description',
    productType: 'tours',
    productPrice: 99.99,
    productDuration: 120,
    productDate: '2024-01-16',
    productStartTime: '09:00',
    productEndTime: '11:00',
    productImageURL: 'https://example.com/product.jpg'
  };

  const currentConfig = editType === 'vendor' ? vendorConfig : productConfig;
  const currentData = editType === 'vendor' ? mockVendorData : mockProductData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('editCardTest')}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {t('editCardTestDescription')}
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <ToggleButtonGroup
          value={editType}
          exclusive
          onChange={(_, value) => value && setEditType(value)}
          aria-label="edit type"
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

      <EditCard
        config={currentConfig}
        initialData={currentData}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
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
          {JSON.stringify(currentData, null, 2)}
        </Box>
      </Paper>
    </Container>
  );
}