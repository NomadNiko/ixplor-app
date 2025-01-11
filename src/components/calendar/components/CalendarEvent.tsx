import  Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EVENT_COLORS } from '../utils/eventUtils';
import type { CalendarEvent } from '../types';

interface CalendarEventProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, element: HTMLElement) => void;
}

export function CalendarEvent({ event, onClick }: CalendarEventProps) {
  return (
    <Box
      sx={{
        backgroundColor: EVENT_COLORS[event.type],
        color: 'white',
        p: 0.5,
        borderRadius: 1,
        mb: 0.5,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.9,
        },
      }}
      onClick={(e) => onClick(event, e.currentTarget)}
    >
      <Typography variant="caption" noWrap>
        {event.title}
      </Typography>
    </Box>
  );
}
