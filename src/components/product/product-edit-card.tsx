import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { Product } from "@/app/[language]/types/product";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { Save, X } from 'lucide-react';
import InputAdornment from '@mui/material/InputAdornment';

interface ProductEditCardProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductEditCard: React.FC<ProductEditCardProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState({
    productName: product.productName,
    productDescription: product.productDescription,
    productType: product.productType,
    productPrice: product.productPrice,
    productDuration: product.productDuration || '',
    productDate: product.productDate || '',
    productStartTime: product.productStartTime || '',
    productEndTime: product.productEndTime || '',
    productAdditionalInfo: product.productAdditionalInfo || '',
    productRequirements: product.productRequirements || [],
    productImageURL: product.productImageURL || '',
    productWaiver: product.productWaiver || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value) {
        setFormData(prev => ({
          ...prev,
          productRequirements: [...prev.productRequirements, value]
        }));
        target.value = '';
      }
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productRequirements: prev.productRequirements.filter((_, i) => i !== index)
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

      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          productStatus: product.productStatus
        })
      });

      if (response.ok) {
        enqueueSnackbar(t('success.updated'), { variant: 'success' });
        onSave();
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('productEditing')}
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            name="productName"
            label={t('productName')}
            value={formData.productName}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            name="productDescription"
            label={t('productDescription')}
            value={formData.productDescription}
            onChange={handleInputChange}
          />

          <TextField
            select
            fullWidth
            name="productType"
            label={t('productType')}
            value={formData.productType}
            onChange={handleInputChange}
          >
            {['tours', 'lessons', 'rentals', 'tickets'].map((type) => (
              <MenuItem key={type} value={type}>
                {t(`productTypes.${type}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            name="productPrice"
            label={t('productPrice')}
            value={formData.productPrice}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            type="number"
            name="productDuration"
            label={t('productDuration')}
            value={formData.productDuration}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">{t('hours')}</InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            name="productImageURL"
            label={t('productImageURL')}
            value={formData.productImageURL}
            onChange={handleInputChange}
          />

          <Box>
            <TextField
              fullWidth
              label={t('productRequirements')}
              placeholder={t('requirementsHelp')}
              onKeyDown={handleRequirementsChange}
            />
            {formData.productRequirements.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {formData.productRequirements.map((req, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5
                    }}
                  >
                    • {req}
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveRequirement(index)}
                    >
                      <X size={14} />
                    </Button>
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            name="productWaiver"
            label={t('productWaiver')}
            value={formData.productWaiver}
            onChange={handleInputChange}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
            color="primary"
            startIcon={<Save size={16} />}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {t("save")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};