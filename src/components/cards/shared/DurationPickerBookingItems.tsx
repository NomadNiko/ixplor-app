import React from 'react';
import { Control, useController } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { BookingFormData } from '@/components/booking-items/types';

export interface DurationPickerBookingItemsProps {
  name: keyof BookingFormData;
  label: string;
  control: Control<BookingFormData>;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const UnitContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
}));

export const DurationPickerBookingItems: React.FC<DurationPickerBookingItemsProps> = ({
  name,
  label,
  control,
  required = false,
  error,
  disabled = false
}) => {
  const {
    field: { value, onChange }
  } = useController({
    name,
    control,
    rules: { required }
  });

  const handleChange = (delta: number) => {
    const newValue = Math.max(0, (value as number || 0) + delta);
    onChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" gutterBottom>
        {label} {required && '*'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <UnitContainer>
          <IconButton 
            onClick={() => handleChange(30)} 
            disabled={disabled}
          >
            <ChevronUp size={16} />
          </IconButton>
          <Typography variant="h6">
            {value || 0}
          </Typography>
          <IconButton 
            onClick={() => handleChange(-30)} 
            disabled={disabled || (value as number || 0) <= 0}
          >
            <ChevronDown size={16} />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            Minutes
          </Typography>
        </UnitContainer>
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DurationPickerBookingItems;