import { useMemo } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { useFormContext, useWatch } from 'react-hook-form';

interface FormValues {
  selectedDates: Date[];
}

export default function ShiftCalendarSelector() {
  const { setValue, control } = useFormContext<FormValues>();
  const selectedDates = useWatch({
    control,
    name: 'selectedDates',
    defaultValue: []
  });
  const theme = useTheme();

  const calendarData = useMemo(() => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const monthOne = {
      days: eachDayOfInterval({
        start: startOfMonth(today),
        end: endOfMonth(today)
      }),
      monthLabel: format(today, 'MMMM yyyy')
    };

    const monthTwo = {
      days: eachDayOfInterval({
        start: startOfMonth(nextMonth),
        end: endOfMonth(nextMonth)
      }),
      monthLabel: format(nextMonth, 'MMMM yyyy')
    };

    return [monthOne, monthTwo];
  }, []);

  const toggleDate = (date: Date) => {
    const newSelectedDates = selectedDates.some((d: Date) => isSameDay(new Date(d), date))
      ? selectedDates.filter((d: Date) => !isSameDay(new Date(d), date))
      : [...selectedDates, date];

    setValue('selectedDates', newSelectedDates, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <Box>
      {calendarData.map((month, monthIndex) => (
        <Box
          key={monthIndex}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 2,
            border: 1,
            borderColor: 'divider',
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {month.monthLabel}
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography
                key={day}
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  p: 1
                }}
              >
                {day}
              </Typography>
            ))}

            {Array.from({ length: new Date(month.days[0]).getDay() }).map((_, i) => (
              <Box key={`empty-${i}`} sx={{ p: 1 }} />
            ))}

            {month.days.map((date, index) => {
              const isSelected = selectedDates.some((d: Date) => isSameDay(new Date(d), date));
              const isTodayDate = isToday(date);

              return (
                <Box
                  key={index}
                  component="button"
                  type="button"
                  onClick={() => toggleDate(date)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    bgcolor: isSelected ? 'primary.main' : 'background.default',
                    color: isSelected ? 'primary.contrastText' : 'text.primary',
                    ...(isTodayDate && {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: -2
                    }),
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'action.hover'
                    }
                  }}
                >
                  {format(date, 'd')}
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
      
      <Typography variant="body2" color="text.secondary">
        {selectedDates.length} dates selected
      </Typography>
    </Box>
  );
}