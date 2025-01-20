// src/components/onboarding/steps/BusinessInfoStep.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { StepProps } from '../types';

const VENDOR_TYPES = ['tours', 'lessons', 'rentals', 'tickets'] as const;

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
            <FormControl fullWidth error={!!error}>
              <InputLabel>{t("vendorTypes")}</InputLabel>
              <Select
                {...field}
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip 
                        key={value} 
                        label={t(`vendorTypes.${value}`)} 
                        size="small" 
                      />
                    ))}
                  </Box>
                )}
              >
                {VENDOR_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`vendorTypes.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
    </>
  );
};