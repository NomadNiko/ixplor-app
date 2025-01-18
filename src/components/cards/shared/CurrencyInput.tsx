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
  const convertValue = (value: BaseFieldValue): number | null => {
    if (value === null) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
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
          value={convertValue(value)}
          onChange={onChange}
          label={label}
          error={!!error}
          helperText={error}
          required={required}
          disabled={disabled}
          onCurrencyChange={onCurrencyChange}
        />
      )}
    />
  );
};

export default CurrencyInput;