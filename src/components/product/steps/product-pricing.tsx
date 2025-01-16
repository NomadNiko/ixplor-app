import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Controller } from 'react-hook-form';
import { StepProps } from './product-form-types';

export const PricingStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <Grid item xs={12}>
      <Controller
        name="productPrice"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
          <TextField
            {...field}
            value={value}
            onChange={(e) => {
              // Convert the string value to a number and handle empty/invalid inputs
              const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
              if (!isNaN(newValue)) {
                onChange(newValue);
              }
            }}
            fullWidth
            type="number"
            inputProps={{
              min: 0,
              step: "0.01"
            }}
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

export default PricingStep;