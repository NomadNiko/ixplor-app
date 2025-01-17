"use client";
import { useState } from 'react';
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { vendorConfig, productConfig } from '@/components/cards/edit-cards/configs';
import { FormData } from '@/components/cards/edit-cards/types';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { VendorStatusEnum } from '@/app/[language]/types/vendor';

export default function EditCardTestContainer() {
  const { t } = useTranslation("tests");
  const { enqueueSnackbar } = useSnackbar();
  const [editType, setEditType] = useState<'vendor' | 'product'>('vendor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormData>({});
  const [currentStatus, setCurrentStatus] = useState<ProductStatusEnum | VendorStatusEnum>(
    editType === 'vendor' ? VendorStatusEnum.SUBMITTED : ProductStatusEnum.DRAFT
  );

  const handleSave = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving data:', data);
      setCurrentFormData(data);
      enqueueSnackbar(t('success.saved'), { variant: 'success' });
    } catch (error) {
      console.error('Error saving:', error);
      enqueueSnackbar(t('errors.saveFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: ProductStatusEnum | VendorStatusEnum) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStatus(status);
      enqueueSnackbar(t('success.saved'), { variant: 'success' });
    } catch (error) {
      console.error('Error changing status:', error);
      enqueueSnackbar(t('errors.saveFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentFormData(editType === 'vendor' ? mockVendorData : mockProductData);
    enqueueSnackbar(t('canceled'), { variant: 'error' });
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentFormData({});
      enqueueSnackbar(t('success.deleted'), { variant: 'success' });
    } catch (error) {
      console.error('Error deleting:', error);
      enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
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
    productEndTime: '',
    productImageURL: ''
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: 'vendor' | 'product' | null) => {
    if (value) {
      setEditType(value);
      setCurrentFormData(value === 'vendor' ? mockVendorData : mockProductData);
      setCurrentStatus(value === 'vendor' ? VendorStatusEnum.SUBMITTED : ProductStatusEnum.DRAFT);
    }
  };

  const currentConfig = {
    ...(editType === 'vendor' ? vendorConfig : productConfig),
    approvalButtons: {
      type: editType,
      currentStatus: currentStatus,
      onStatusChange: handleStatusChange
    }
  };

  const handleFormChange = (data: FormData) => {
    setCurrentFormData(data);
  };

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
          onChange={handleTypeChange}
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
        initialData={currentFormData}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
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
          {JSON.stringify({
            formData: currentFormData,
            status: currentStatus
          }, null, 2)}
        </Box>
      </Paper>
    </Container>
  );
}