import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";
import { Image } from "@nextui-org/react";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTheme } from "@mui/material/styles";
import MenuItem from '@mui/material/MenuItem';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import Divider from "@mui/material/Divider";
import { Save, X } from 'lucide-react';

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
  const theme = useTheme();
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
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          mb: 2,
        }}>
          <Box sx={{
            width: { xs: "100%", sm: 100 },
            height: { xs: 100, sm: 100 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Image
              src={formData.logoUrl}
              alt={formData.businessName}
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {t('editVendor')}
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                fullWidth
                label={t('businessName')}
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('description')}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />

              <TextField
                select
                fullWidth
                label={t('vendorType')}
                name="vendorType"
                value={formData.vendorType}
                onChange={handleInputChange}
              >
                {['tours', 'lessons', 'rentals', 'tickets'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h6">{t('contact')}</Typography>
          <TextField
            fullWidth
            label={t('email')}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label={t('phone')}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label={t('website')}
            name="website"
            value={formData.website}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label={t('logoUrl')}
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleInputChange}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h6">{t('location')}</Typography>
          <TextField
            fullWidth
            label={t('address')}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              label={t('city')}
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label={t('state')}
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label={t('postalCode')}
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h6">{t('adminNotes')}</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('adminNotes')}
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleInputChange}
          />
        </Box>

        <Box sx={{
          display: "flex",
          gap: 1,
          mt: 2,
          justifyContent: "flex-end"
        }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<X size={16} />}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ background: theme.palette.success.main }}
          >
            {t("save")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorEditCard;