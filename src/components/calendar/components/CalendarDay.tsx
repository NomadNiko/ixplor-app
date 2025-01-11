import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format, isSameDay, isSameMonth } from 'date-fns';
import type { CalendarView, CalendarEvent } from '../types';

interface CalendarDayProps {
  date: Date;
  view: CalendarView;
  currentDate: Date;
  events: CalendarEvent[];
  onClick: (date: Date) => void;
  renderEvent: (event: CalendarEvent) => React.ReactNode;
}

export function CalendarDay({
  date,
  view,
  currentDate,
  events,
  onClick,
  renderEvent
}: CalendarDayProps) {
  const isToday = isSameDay(date, new Date());
  const isCurrentMonth = isSameMonth(date, currentDate);

  return (
    <Box
      sx={{
        height: view === 'month' ? 120 : '100%',
        p: 1,
        backgroundColor: isToday ? 'action.hover' : 'background.paper',
        opacity: isCurrentMonth ? 1 : 0.5,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onClick={() => onClick(date)}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: isToday ? 'bold' : 'regular',
          color: isToday ? 'primary.main' : 'text.primary',
        }}
      >
        {format(date, view === 'month' ? 'd' : 'MMM d')}
      </Typography>
      <Box sx={{ mt: 1 }}>
        {events.map(renderEvent)}
      </Box>
    </Box>
  );
}
