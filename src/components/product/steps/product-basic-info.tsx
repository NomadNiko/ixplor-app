import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import { StepProps } from './product-form-types';

export const BasicInfoStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name="productName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("productName")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="productDescription"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("productDescription")}
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
          name="productType"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              select
              label={t("productType")}
              error={!!error}
              helperText={error?.message}
            >
              {['tours', 'lessons', 'rentals', 'tickets'].map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`productTypes.${type}`)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
    </>
  );
};