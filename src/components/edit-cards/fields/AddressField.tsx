import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from '@/services/i18n/client';
import { FieldConfig, FormData } from '../types';

interface AddressFieldProps {
  field: FieldConfig;
}

export const AddressField: React.FC<AddressFieldProps> = ({ field }) => {
  const { register } = useFormContext<FormData>();
  const { errors } = useFormState();
  const { t } = useTranslation('tests');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          {...register('address', { required: field.required })}
          label={t('address')}
          fullWidth
          error={!!errors.address}
          helperText={errors.address?.message as string}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          {...register('city', { required: field.required })}
          label={t('city')}
          fullWidth
          error={!!errors.city}
          helperText={errors.city?.message as string}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          {...register('state', { required: field.required })}
          label={t('state')}
          fullWidth
          error={!!errors.state}
          helperText={errors.state?.message as string}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          {...register('postalCode', { required: field.required })}
          label={t('postalCode')}
          fullWidth
          error={!!errors.postalCode}
          helperText={errors.postalCode?.message as string}
        />
      </Grid>
    </Grid>
  );
};