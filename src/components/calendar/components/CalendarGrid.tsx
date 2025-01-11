import  Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format} from 'date-fns';
import type { CalendarView, CalendarEvent } from '../types';
import { CalendarDay } from './CalendarDay';
import { TimeGrid } from './TimeGrid';

interface CalendarGridProps {
  view: CalendarView;
  currentDate: Date;
  days: Date[];
  eventsByDay: Map<string, CalendarEvent[]>;
  onDateClick: (date: Date) => void;
  renderEvent: (event: CalendarEvent) => React.ReactNode;
}

export function CalendarGrid({
  view,
  currentDate,
  days,
  eventsByDay,
  onDateClick,
  renderEvent
}: CalendarGridProps) {
  return view === 'month' ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0,
        height: '100%',
      }}
    >
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <Box
          key={day}
          sx={{
            p: 1,
            textAlign: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption">{day}</Typography>
        </Box>
      ))}
      {days.map(date => (
        <CalendarDay
          key={date.toISOString()}
          date={date}
          view={view}
          currentDate={currentDate}
          events={eventsByDay.get(format(date, 'yyyy-MM-dd')) || []}
          onClick={onDateClick}
          renderEvent={renderEvent}
        />
      ))}
    </Box>
  ) : (
    <TimeGrid
      days={days}
      events={eventsByDay}
      onDateClick={onDateClick}
      renderEvent={renderEvent}
    />
  );
}