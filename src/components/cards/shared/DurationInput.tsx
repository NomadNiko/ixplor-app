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
  // Generate duration options in 15-minute intervals (up to 8 hours)
  const durationOptions = Array.from({ length: 32 }, (_, i) => i * 15);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    return mins === 0 ? `${hours} hours` : `${hours} hours ${mins} minutes`;
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