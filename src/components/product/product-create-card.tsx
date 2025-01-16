import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { Save, X } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";


// MUST FIX LATER !!! Default location coordinates (Waikiki Beach) and mock vendor ID 
const DEFAULT_LATITUDE = 21.2758128;
const DEFAULT_LONGITUDE = -157.8241926;
const DEFAULT_VENDOR_ID = "65c0e95eee124a74bee35b7f";


interface ProductFormData {
  productName: string;
  productDescription: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productPrice: number;
  productDuration: number | "";
  productDate: Date | null;
  productStartTime: Date | null;
  productEndTime: Date | null;
  productAdditionalInfo: string;
  productRequirements: string[];
  productImageURL: string;
  productWaiver: string;
}

function ProductFormFields() {
  const { t } = useTranslation("products");
  const { control, setValue } = useFormContext<ProductFormData>();
  const formData = useWatch({
    control,
    defaultValue: {
      productName: '',
      productDescription: '',
      productType: 'tours',
      productPrice: 0,
      productDuration: '',
      productDate: null,
      productStartTime: null,
      productEndTime: null,
      productAdditionalInfo: '',
      productRequirements: [],
      productImageURL: '',
      productWaiver: '',
    }
  });

  const handleRequirementsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value) {
        setValue('productRequirements', [...(formData?.productRequirements || []), value]);
        target.value = '';
      }
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const currentRequirements = formData?.productRequirements || [];
    setValue('productRequirements',
      currentRequirements.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
      <TextField
        fullWidth
        label={t('fields.productName')}
        name="productName"
        value={formData?.productName || ''}
        onChange={(e) => setValue('productName', e.target.value)}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label={t('fields.productDescription')}
        name="productDescription"
        value={formData?.productDescription || ''}
        onChange={(e) => setValue('productDescription', e.target.value)}
      />

      <TextField
        select
        fullWidth
        label={t('fields.productType')}
        name="productType"
        value={formData?.productType || 'tours'}
        onChange={(e) => setValue('productType', e.target.value as "tours" | "lessons" | "rentals" | "tickets")}
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
        label={t('fields.productPrice')}
        value={formData?.productPrice || 0}
        onChange={(e) => setValue('productPrice', Number(e.target.value))}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />

      <TextField
        fullWidth
        type="number"
        name="productDuration"
        label={t('fields.productDuration')}
        value={formData?.productDuration || ''}
        onChange={(e) => setValue('productDuration', Number(e.target.value))}
        InputProps={{
          endAdornment: <InputAdornment position="end">{t('hours')}</InputAdornment>,
        }}
      />

      <FormDatePickerInput name="productDate" label={t('fields.productDate')} />
      
      <FormTimePickerInput
        name="productStartTime"
        label={t('fields.productStartTime')}
        format="HH:mm"
      />

      <FormTimePickerInput
        name="productEndTime"
        label={t('fields.productEndTime')}
        format="HH:mm"
      />

      <TextField
        fullWidth
        name="productImageURL"
        label={t('fields.productImageURL')}
        value={formData?.productImageURL || ''}
        onChange={(e) => setValue('productImageURL', e.target.value)}
      />

      <Box>
        <TextField
          fullWidth
          label={t('fields.productRequirements')}
          placeholder={t('requirementsHelp')}
          onKeyDown={handleRequirementsChange}
        />
        {formData?.productRequirements && formData.productRequirements.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {formData.productRequirements.map((req, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
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
        label={t('fields.productWaiver')}
        value={formData?.productWaiver || ''}
        onChange={(e) => setValue('productWaiver', e.target.value)}
      />
    </Box>
  );
}

export default function ProductCreateCard() {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ProductFormData>({
    defaultValues: {
      productName: '',
      productDescription: '',
      productType: 'tours',
      productPrice: 0,
      productDuration: '',
      productDate: null,
      productStartTime: null,
      productEndTime: null,
      productAdditionalInfo: '',
      productRequirements: [],
      productImageURL: '',
      productWaiver: '',
    }
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        router.push('/sign-in');
        return;
      }

      const submissionData = {
        ...data,
        productDate: data.productDate ? format(data.productDate, "yyyy-MM-dd") : undefined,
        productStartTime: data.productStartTime ? format(data.productStartTime, "HH:mm") : undefined,
        productEndTime: data.productEndTime ? format(data.productEndTime, "HH:mm") : undefined,
        productStatus: 'DRAFT',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        vendorId: DEFAULT_VENDOR_ID,
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        enqueueSnackbar(t('success.productCreated'), { variant: 'success' });
        router.push('/products');
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([key, message]) => {
            enqueueSnackbar(`${key}: ${message}`, { variant: 'error' });
          });
        }
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      enqueueSnackbar(t('errors.productCreation'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Box sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3 
          }}>
            <Typography variant="h5">
              {t('productCreation')}
            </Typography>
          </Box>

          <ProductFormFields />

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            justifyContent: "flex-end" 
          }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<X size={16} />}
              onClick={() => router.push('/products')}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save size={16} />}
              onClick={methods.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
            >
              {t('save')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
}