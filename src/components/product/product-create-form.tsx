import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from '@/hooks/use-snackbar';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { BasicInfoStep } from './steps/product-basic-info';
import { PricingStep } from './steps/product-pricing';
import { DetailsStep } from './steps/product-details';
import { SchedulingStep } from './steps/product-scheduling';
import { z } from 'zod';
import { API_URL } from '@/services/api/config';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(1, 'Description is required'),
  productType: z.enum(['tours', 'lessons', 'rentals', 'tickets']),
  productPrice: z.number().min(0, 'Price must be greater than 0'),
  productDuration: z.number().optional(),
  productDate: z.string().optional(),
  productStartTime: z.string().optional(),
  productEndTime: z.string().optional(),
  productAdditionalInfo: z.string().optional(),
  productRequirements: z.array(z.string()).optional(),
  productImageURL: z.string().url().optional(),
  productWaiver: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductCreationForm() {
  const { t } = useTranslation("products");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      productType: 'tours',
      productPrice: 0,
      productDuration: undefined,
      productDate: undefined,
      productStartTime: undefined,
      productEndTime: undefined,
      productAdditionalInfo: '',
      productRequirements: [],
      productImageURL: '',
      productWaiver: '',
    }
  });

  const { handleSubmit, trigger, control } = methods;

  const steps = [
    'Basic Information',
    'Pricing',
    'Details',
    'Scheduling'
  ];

  const handleNext = async () => {
    let isStepValid = false;
    switch (activeStep) {
      case 0:
        isStepValid = await trigger(['productName', 'productDescription', 'productType']);
        break;
      case 1:
        isStepValid = await trigger(['productPrice']);
        break;
      case 2:
        isStepValid = await trigger(['productAdditionalInfo', 'productRequirements', 'productImageURL', 'productWaiver']);
        break;
      case 3:
        isStepValid = await trigger(['productDuration', 'productDate', 'productStartTime', 'productEndTime']);
        break;
    }
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (formData: ProductFormData) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        router.push('/sign-in');
        return;
      }

      const productResponse = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          productStatus: 'PUBLISHED'
        })
      });

      if (productResponse.ok) {
        enqueueSnackbar(t('success.productCreated'), { variant: 'success' });
        router.push('/products');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(t('errors.productCreation'), { variant: 'error' });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoStep control={control} t={t} />;
      case 1:
        return <PricingStep control={control} t={t} />;
      case 2:
        return <DetailsStep control={control} t={t} />;
      case 3:
        return <SchedulingStep control={control} t={t} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("productCreation")}
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderStepContent(activeStep)}

              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}