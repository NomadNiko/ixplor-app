import { useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { Clock } from 'lucide-react';
import { Theme } from '@mui/material/styles';

interface TimeSlotSelectorProps {
  isCheckingAvailability: boolean;
  availableSlots: string[];
  t: (key: string) => string;
}

export const TimeSlotSelector = ({ 
  isCheckingAvailability, 
  availableSlots,
  t 
}: TimeSlotSelectorProps) => {
  const { control, setValue } = useFormContext();
  const selectedDate = useWatch({ control, name: 'selectedDate' });
  const selectedTime = useWatch({ control, name: 'selectedTime' });

  useEffect(() => {
    if (!selectedDate) {
      setValue('selectedTime', null);
    }
  }, [selectedDate, setValue]);

  const handleTimeSelect = (time: string | null) => {
    setValue('selectedTime', time);
  };

  if (!selectedDate) return null;

  if (isCheckingAvailability) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: (theme: Theme) => theme.spacing(3) 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: (theme: Theme) => theme.spacing(3) }}>
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Clock size={16} />
        {t('selectTime')}
      </Typography>
      {availableSlots.length > 0 ? (
        <ToggleButtonGroup
          value={selectedTime}
          exclusive
          onChange={(_, value) => handleTimeSelect(value)}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {availableSlots.map((time) => (
            <ToggleButton 
              key={time} 
              value={time}
              sx={{
                flex: '1 0 calc(33.33% - 8px)',
                minWidth: (theme: Theme) => theme.spacing(10)
              }}
            >
              {time}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : (
        <Typography color="error">
          {t('noAvailableSlots')}
        </Typography>
      )}
    </Box>
  );
};

export default TimeSlotSelector;