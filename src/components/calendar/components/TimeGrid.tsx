import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import type { CalendarEvent } from '../types';
import { CalendarDay } from './CalendarDay';

interface TimeGridProps {
  days: Date[];
  events: Map<string, CalendarEvent[]>;
  onDateClick: (date: Date) => void;
  renderEvent: (event: CalendarEvent) => React.ReactNode;
}

export function TimeGrid({
  days,
  events,
  onDateClick,
  renderEvent
}: TimeGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: 60, borderRight: 1, borderColor: 'divider' }}>
        {hours.map(hour => (
          <Typography
            key={hour}
            variant="caption"
            sx={{ height: 60, display: 'block', p: 1 }}
          >
            {format(new Date().setHours(hour), 'ha')}
          </Typography>
        ))}
      </Box>
      <Box sx={{ flex: 1, display: 'flex' }}>
        {days.map(date => (
          <Box
            key={date.toISOString()}
            sx={{
              flex: 1,
              borderRight: 1,
              borderColor: 'divider',
              position: 'relative'
            }}
          >
            <CalendarDay
              date={date}
              view="day"
              currentDate={date}
              events={events.get(format(date, 'yyyy-MM-dd')) || []}
              onClick={onDateClick}
              renderEvent={renderEvent}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
