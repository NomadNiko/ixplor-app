import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Control, useController } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { FormData } from './types';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2)
}));

const UnitContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.4),
  }
}));

interface DurationPickerProps {
  name: string;
  label: string;
  control: Control<FormData>;
  required?: boolean;
  error?: string;
}

const DurationPicker = ({ name, label, control, required = false, error }: DurationPickerProps) => {
  const {
    field: { value, onChange }
  } = useController({
    name,
    control,
    rules: { required }
  });

  // Convert total minutes to hours and minutes
  const totalMinutes = Number(value) || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const handleHoursChange = (delta: number) => {
    const newHours = Math.max(0, Math.min(48, hours + delta));
    const newTotalMinutes = (newHours * 60) + minutes;
    onChange(newTotalMinutes);
  };

  const handleMinutesChange = (delta: number) => {
    let newMinutes = minutes + delta;
    if (newMinutes >= 60) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 55;
    // Round to nearest 5
    newMinutes = Math.round(newMinutes / 5) * 5;
    const newTotalMinutes = (hours * 60) + newMinutes;
    onChange(newTotalMinutes);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        color={error ? 'error' : 'text.secondary'}
      >
        {label} {required && <Box component="span" color="error.main">*</Box>}
      </Typography>
      
      <StyledContainer>
        {/* Hours */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleHoursChange(1)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {hours.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleHoursChange(-1)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Hrs
          </Typography>
        </UnitContainer>

        {/* Minutes */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleMinutesChange(5)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {minutes.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleMinutesChange(-5)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Mins
          </Typography>
        </UnitContainer>
      </StyledContainer>
      
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DurationPicker;