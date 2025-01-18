import React, { useMemo, useCallback, useState } from 'react';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'BTC', symbol: '₿', label: 'Bitcoin' },
];

export interface BaseCurrencyInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string | number | null;
  onChange: (value: number | null) => void;
  onCurrencyChange?: (currency: string) => void;
}

export const BaseCurrencyInput: React.FC<BaseCurrencyInputProps> = ({
  value,
  onChange,
  onCurrencyChange,
  label,
  error,
  disabled = false,
  ...props
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCY_OPTIONS[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: selectedCurrency.code === 'BTC' ? 8 : 2,
      maximumFractionDigits: selectedCurrency.code === 'BTC' ? 8 : 2
    });
  }, [selectedCurrency]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrencySelect = (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency.code);
    }
    handleClose();
  };

  const formatForDisplay = useCallback((val: string | number | null): string => {
    if (val === null || val === '') return '';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '';
    return formatter.format(num).replace(selectedCurrency.symbol, '').trim();
  }, [formatter, selectedCurrency]);

  const parseValue = (val: string): number | null => {
    if (!val.trim()) return null;
    const cleanValue = val.replace(selectedCurrency.symbol, '')
                         .replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? null : parsed;
  };

  return (
    <>
      <TextField
        {...props}
        value={formatForDisplay(value)}
        onChange={(e) => {
          const inputValue = e.target.value;
          onChange(parseValue(inputValue));
        }}
        onFocus={(e) => {
          e.target.select();
        }}
        label={label}
        fullWidth
        error={!!error}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton 
                size="small" 
                onClick={handleClick}
                sx={{ 
                  fontSize: '1rem',
                  padding: (theme: Theme) => theme.spacing(0.5),
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {selectedCurrency.symbol}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ 
          shrink: true,
          sx: {
            transform: 'translate(36px, -9px) scale(0.75)'
          }
        }}
        sx={{
          mb: (theme) => theme.spacing(3),
          mt: (theme) => theme.spacing(1),
          '& .MuiInputBase-root': {
            height: '56px'
          }
        }}
      />
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {CURRENCY_OPTIONS.map((currency) => (
          <MenuItem
            key={currency.code}
            onClick={() => handleCurrencySelect(currency)}
            selected={currency.code === selectedCurrency.code}
          >
            {currency.symbol} - {currency.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};