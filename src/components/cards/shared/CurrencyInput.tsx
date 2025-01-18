import React, { useMemo } from 'react';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Controller, Control } from "react-hook-form";
import { BaseFieldValue, FormData } from './types';

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
  // Get user's locale and currency formatting options
  const locale = navigator.language;
  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: getCurrencyCode(locale),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, [locale]);

  // Get currency symbol for the current locale
  const currencySymbol = useMemo(() => {
    return formatter.format(0).replace(/[\d.,\s]/g, '');
  }, [formatter]);

  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const digits = value.replace(/[^\d.]/g, '');
    
    // Handle multiple decimal points
    const parts = digits.split('.');
    const cleanValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    const number = Number(cleanValue);
    if (isNaN(number)) return '';
    
    // Format the number without the currency symbol
    return number.toFixed(2);
  };

  const displayValue = (value: BaseFieldValue): string => {
    if (value === null || value === '') return '';
    const numValue = Number(value);
    if (isNaN(numValue)) return '';
    return numValue.toFixed(2);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          value={displayValue(value)}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d.]/g, '');
            const formatted = formatCurrency(rawValue);
            onChange(formatted ? Number(formatted) : '');
          }}
          label={label}
          fullWidth
          error={!!error}
          helperText={error}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{currencySymbol}</InputAdornment>
            ),
          }}
          InputLabelProps={{ 
            shrink: true,
            sx: {
              transform: 'translate(28px, -9px) scale(0.75)'
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

// Helper function to determine currency code based on locale
function getCurrencyCode(locale: string): string {
  const region = new Intl.Locale(locale).region;
  
  const currencyMap: { [key: string]: string } = {
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    // Add more country-to-currency mappings as needed
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'NL': 'EUR',
    'BE': 'EUR',
    'AT': 'EUR',
    'IE': 'EUR',
    'FI': 'EUR',
    'GR': 'EUR',
    'PT': 'EUR',
    'CA': 'CAD',
    'AU': 'AUD',
    'JP': 'JPY',
    'CN': 'CNY',
    'IN': 'INR',
    'BR': 'BRL',
    'RU': 'RUB',
    'KR': 'KRW',
    'CH': 'CHF',
    'SE': 'SEK',
    'NO': 'NOK',
    'DK': 'DKK',
    'NZ': 'NZD',
    'SG': 'SGD',
    'HK': 'HKD',
    'MX': 'MXN'
  };

  return region ? currencyMap[region] || 'USD' : 'USD';
}

export default CurrencyInput;