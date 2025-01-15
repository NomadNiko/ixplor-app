import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import { StepProps } from '../types';

export const ContactDetailsStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              type="email"
              label={t("email")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("phone")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="website"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("website")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="logoUrl"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("logoUrl")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </>
  );
};