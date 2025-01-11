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
          minHeight: view === 'day' ? '800px' : undefined,
          p: 1,
          backgroundColor: isToday ? 'action.hover' : 'background.paper',
          opacity: isCurrentMonth ? 1 : 0.5,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
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
            mb: 1,
          }}
        >
          {format(date, view === 'month' ? 'd' : 'MMM d')}
        </Typography>
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {events.map(renderEvent)}
        </Box>
      </Box>
    );
  }