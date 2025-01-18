// utils/currency.tsx
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

export interface BaseCurrencyInputProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  onCurrencyChange?: (currency: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export const BaseCurrencyInput: React.FC<BaseCurrencyInputProps> = ({
  value,
  onChange,
  onCurrencyChange,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCY_OPTIONS[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCurrencySelect = (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency.code);
    }
    handleMenuClose();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <CurrencyInput
          value={value?.toString()}
          onValueChange={(value) => {
            onChange(value ? Number(value) : null);
          }}
          disabled={disabled}
          className={`w-full p-3 outline-none rounded-md border ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100' : ''}`}
          placeholder="0.00"
          decimalsLimit={2}
          decimalSeparator="."
          groupSeparator=","
          allowNegativeValue={false}
          prefix={`${selectedCurrency.symbol} `}
        />
        
        <IconButton
          onClick={handleCurrencyClick}
          size="small"
          className="ml-2"
          disabled={disabled}
          sx={{ position: 'absolute', right: '8px' }}
        >
          {selectedCurrency.code}
        </IconButton>
      </div>
      
      {label && (
        <label className="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
    </div>
  );
};