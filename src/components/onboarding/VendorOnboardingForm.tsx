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
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { ContactDetailsStep } from './steps/ContactDetailsStep';
import { LocationStep } from './steps/LocationStep';
import { vendorSchema, VendorFormData } from './types';
import { PlaceResult } from '@/hooks/use-google-places';

export default function VendorRegistrationForm() {
  const { t } = useTranslation("onboard");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: '',
      description: '',
      vendorType: 'tours',
      email: '',
      phone: '',
      website: '',
      logoUrl: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    },
    mode: 'onChange'
  });


  const { handleSubmit, trigger, control, setValue } = methods;

  const steps = [
    'Business Information',
    'Contact Details',
    'Location'
  ];

  const handleNext = async () => {
    let isStepValid = false;
    switch (activeStep) {
      case 0:
        isStepValid = await trigger(['businessName', 'description', 'vendorType']);
        break;
      case 1:
        isStepValid = await trigger(['email', 'phone', 'website', 'logoUrl']);
        break;
      case 2:
        isStepValid = await trigger(['address', 'city', 'state', 'postalCode', 'location']);
        break;
    }
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setValue('address', placeResult.address);
    setValue('city', placeResult.city);
    setValue('state', placeResult.state);
    setValue('postalCode', placeResult.postalCode);
    setValue('location', {
      type: 'Point', 
      coordinates: [placeResult.longitude, placeResult.latitude]
    });
  };

  const onSubmit = async (formData: VendorFormData) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        router.push('/sign-in');
        return;
      }

      const vendorResponse = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          vendorStatus: 'APPROVED'
        })
      });

      if (vendorResponse.ok) {
        enqueueSnackbar(t('success.vendorCreated'), { variant: 'success' });
        router.push('/admin-panel/vendors');
      } else {
        throw new Error('Failed to create vendor profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(t('errors.vendorCreation'), { variant: 'error' });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BusinessInfoStep control={control} t={t} />;
      case 1:
        return <ContactDetailsStep control={control} t={t} />;
      case 2:
        return <LocationStep control={control} t={t} handleAddressSelect={handleAddressSelect} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("vendorRegistration")}
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
                      <Button
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
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