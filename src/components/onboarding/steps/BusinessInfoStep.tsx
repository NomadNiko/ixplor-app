import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import { StepProps } from '../types';

export const BusinessInfoStep: React.FC<StepProps> = ({ control, t }) => {
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
          name="vendorTypes"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              select
              label={t("vendorTypes")}
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
};