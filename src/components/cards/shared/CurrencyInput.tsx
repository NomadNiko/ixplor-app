import React from 'react';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Controller, Control } from "react-hook-form";
import { FormData } from './types';

interface CurrencyInputProps {
  name: string;
  label: string;
  control: Control<FormData>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  control,
  error,
  required = false,
  disabled = false
}) => {
  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const digits = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = digits.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts[1];
    
    // Format to 2 decimal places
    const number = Number(digits);
    if (isNaN(number)) return '';
    
    return number.toFixed(2);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          value={value || ''}
          onChange={(e) => {
            const formatted = formatCurrency(e.target.value);
            onChange(formatted ? Number(formatted) : '');
          }}
          label={label}
          fullWidth
          error={!!error}
          helperText={error}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
          InputLabelProps={{ 
            shrink: true,
            sx: {
              transform: 'translate(14px, -9px) scale(0.75)'
            }
          }}
          sx={{
            mb: 3,
            mt: 1,
            '& .MuiInputBase-root': {
              height: '56px'
            }
          }}
        />
      )}
    />
  );
};

export default CurrencyInput;