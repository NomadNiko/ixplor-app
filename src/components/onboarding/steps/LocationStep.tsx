import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import { AddressInput } from '@/components/form/address-input/address-input';
import { StepProps } from '../types';

export const LocationStep: React.FC<StepProps> = ({ control, t, handleAddressSelect }) => {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name="address"
          control={control}
          render={({ field: { value }, fieldState: { error } }) => (
            <AddressInput
              value={value}
              onChange={handleAddressSelect!}
              error={error?.message}
              label={t("address")}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
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
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
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
              InputProps={{ readOnly: true }}
            />
          )}
        />
      </Grid>
    </>
  );
};