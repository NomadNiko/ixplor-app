import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import Divider from "@mui/material/Divider";
import { VendorEditHeader } from './vendor-edit-header';
import { VendorEditContact } from './vendor-edit-contact';
import { VendorEditLocation } from './vendor-edit-location';
import { VendorEditActions } from './vendor-edit-actions';

interface VendorEditCardProps {
  vendor: Vendor;
  onSave: () => void;
  onCancel: () => void;
}

export const VendorEditCard: React.FC<VendorEditCardProps> = ({
  vendor,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation("vendor-admin");
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState({
    businessName: vendor.businessName,
    description: vendor.description,
    vendorType: vendor.vendorType,
    email: vendor.email,
    phone: vendor.phone,
    website: vendor.website || '',
    logoUrl: vendor.logoUrl || '',
    address: vendor.address,
    city: vendor.city,
    state: vendor.state,
    postalCode: vendor.postalCode,
    adminNotes: vendor.adminNotes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const response = await fetch(`${API_URL}/vendors/${vendor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          vendorStatus: vendor.vendorStatus,
          location: vendor.location
        })
      });

      if (response.ok) {
        enqueueSnackbar(t('success.updated'), { variant: 'success' });
        onSave();
      } else {
        throw new Error('Failed to update vendor');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <VendorEditHeader
          logoUrl={formData.logoUrl}
          businessName={formData.businessName}
          description={formData.description}
          vendorType={formData.vendorType}
          onChange={handleInputChange}
          t={t}
        />

        <Divider sx={{ my: 2 }} />

        <VendorEditContact
          email={formData.email}
          phone={formData.phone}
          website={formData.website}
          logoUrl={formData.logoUrl}
          onChange={handleInputChange}
          t={t}
        />

        <Divider sx={{ my: 2 }} />

        <VendorEditLocation
          address={formData.address}
          city={formData.city}
          state={formData.state}
          postalCode={formData.postalCode}
          onChange={handleInputChange}
          t={t}
        />

        <Divider sx={{ my: 2 }} />

        <VendorEditActions
          onSave={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          t={t}
        />
      </CardContent>
    </Card>
  );
};

export default VendorEditCard;