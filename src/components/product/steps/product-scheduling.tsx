import React from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';
import FormDatePickerInput from '@/components/form/date-pickers/date-picker';
import FormTimePickerInput from '@/components/form/date-pickers/time-picker';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { StepProps } from './product-form-types';

export const SchedulingStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Controller
          name="productDuration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label={t("productDuration")}
              error={!!error}
              helperText={error?.message}
              InputProps={{
                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="productDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormDatePickerInput
              {...field}
              label={t("productDate")}
              error={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="productStartTime"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormTimePickerInput
              {...field}
              label={t("productStartTime")}
              error={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="productEndTime"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormTimePickerInput
              {...field}
              label={t("productEndTime")}
              error={error?.message}
            />
          )}
        />
      </Grid>
    </>
  );
};