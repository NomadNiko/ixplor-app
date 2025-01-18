import { Control, Controller } from "react-hook-form";
import { FormData, BaseFieldValue } from './types';
import { BaseCurrencyInput } from './utils/currency';

interface CurrencyInputProps {
  name: string;
  label: string;
  control: Control<FormData>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onCurrencyChange?: (currency: string) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  control,
  error,
  required = false,
  disabled = false,
  onCurrencyChange
}) => {
  // Convert BaseFieldValue to the type expected by BaseCurrencyInput
  const convertValue = (value: BaseFieldValue): string | number | null => {
    if (value === null) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    // Handle Date or string[] by returning null
    return null;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value, ...field } }) => (
        <BaseCurrencyInput
          {...field}
          label={label}
          value={convertValue(value)}
          onChange={onChange}
          error={!!error}
          helperText={error}
          disabled={disabled}
          onCurrencyChange={onCurrencyChange}
        />
      )}
    />
  );
};

export default CurrencyInput;