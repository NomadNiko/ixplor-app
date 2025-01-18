import React from 'react';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Controller, Control } from "react-hook-form";
import { FormData } from './types';

interface DurationInputProps {
  name: string;
  label: string;
  control: Control<FormData>;
  error?: string;
  required?: boolean;
}

const DurationInput: React.FC<DurationInputProps> = ({
  name,
  label,
  control,
  error,
  required = false
}) => {
  // Generate duration options from 0 to 8 hours (480 minutes) in 15-minute increments
  const durationOptions = Array.from({ length: 33 }, (_, i) => i * 15);

  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return "No duration";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let durationString = "";
    
    if (hours > 0) {
      durationString += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    if (remainingMinutes > 0) {
      if (hours > 0) durationString += " ";
      durationString += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    
    return durationString;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <TextField
          select
          {...field}
          label={label}
          fullWidth
          error={!!error}
          helperText={error}
          value={field.value || ''}
        >
          {durationOptions.map((duration) => (
            <MenuItem key={duration} value={duration}>
              {formatDuration(duration)}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default DurationInput;