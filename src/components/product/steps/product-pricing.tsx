import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import { StepProps } from './product-form-types';

export const PricingStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="productPrice"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            label={t("productPrice")}
            error={!!error}
            helperText={error?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        )}
      />
    </Grid>
  );
};