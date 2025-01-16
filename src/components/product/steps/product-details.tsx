import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { StepProps } from './product-form-types';

export const DetailsStep: React.FC<StepProps> = ({ control, t }) => {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name="productImageURL"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={t("productImageURL")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="productAdditionalInfo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={3}
              label={t("productAdditionalInfo")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="productRequirements"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <TextField
                fullWidth
                label={t("productRequirements")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    const requirement = target.value.trim();
                    if (requirement) {
                      onChange([...(value || []), requirement]);
                      target.value = '';
                    }
                  }
                }}
                error={!!error}
                helperText={error?.message || t("requirementsHelp")}
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {value?.map((requirement: string, index: number) => (
                  <Chip
                    key={index}
                    label={requirement}
                    onDelete={() => {
                      const newRequirements = [...value];
                      newRequirements.splice(index, 1);
                      onChange(newRequirements);
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="productWaiver"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label={t("productWaiver")}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </>
  );
};