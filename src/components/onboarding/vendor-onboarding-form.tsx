"use client";
import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from "@/services/i18n/client";

// Validation Schema
const vendorSchema = z.object({
  // Business Information
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  vendorType: z.enum(['tours', 'lessons', 'rentals', 'tickets']),

  // Contact Information
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  website: z.string().url('Invalid URL').optional(),
  logoUrl: z.string().url('Invalid URL').optional(),

  // Location Information
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Invalid postal code')
});

type VendorFormData = z.infer<typeof vendorSchema>;

export default function VendorRegistrationForm() {
  const { t } = useTranslation("vendor");
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
      postalCode: ''
    },
    mode: 'onChange'
  });

  const { handleSubmit, trigger, control, reset } = methods;

  const steps = [
    'Business Information',
    'Contact Details',
    'Location Information'
  ];
  
  useEffect(() => {
      // Reset form when active step changes (form loads for that step)
      if (activeStep === 0) {
        reset({
          businessName: '',
          description: '',
          vendorType: 'tours',
        });
      } else if (activeStep === 1) {
        reset({
          email: '',
          phone: '',
          website: '',
          logoUrl: '',
        });
      } else if (activeStep === 2) {
        reset({
          address: '',
          city: '',
          state: '',
          postalCode: '',
        });
      }
    }, [activeStep, reset]);

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
        isStepValid = await trigger(['address', 'city', 'state', 'postalCode']);
        break;
    }

    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data: VendorFormData) => {
    try {
      const response = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create vendor');
      }

      console.log('Vendor registration successful', data);
      // Optionally reset the entire form after successful submission
      reset();
      setActiveStep(0);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12}>
              <Controller
                name="businessName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("businessName")}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("description")}
                    multiline
                    rows={4}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="vendorType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label={t("vendorType")}
                    error={!!error}
                    helperText={error?.message}
                  >
                    {['tours', 'lessons', 'rentals', 'tickets'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("email")}
                    type="email"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("phone")}
                    type="tel"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="website"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("website")}
                    type="url"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="logoUrl"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("logoUrl")}
                    type="url"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("address")}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="city"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("city")}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="state"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("state")}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="postalCode"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("postalCode")}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </>
        );
      default:
        return 'Unknown step';
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