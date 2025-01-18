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
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  control,
  error,
  required = false,
}) => {
  const formatAsCurrency = (val: string): string => {
    // Remove all non-digits/dots
    const digits = val.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = digits.split('.');
    const cleanNum = parts[0] + (parts[1] ? '.' + parts[1].slice(0, 2) : '');
    
    // Convert to number and format
    const num = parseFloat(cleanNum);
    if (isNaN(num)) return '';
    
    return num.toFixed(2);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          value={value ? formatAsCurrency(value.toString()) : ''}
          onChange={(e) => {
            const formatted = formatAsCurrency(e.target.value);
            onChange(formatted ? parseFloat(formatted) : '');
          }}
          label={label}
          fullWidth
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          sx={{ mb: 2 }}
        />
      )}
    />
  );
};

export default CurrencyInput;