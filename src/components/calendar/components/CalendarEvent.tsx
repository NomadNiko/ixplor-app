import  Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//import { EVENT_COLORS } from '../utils/eventUtils';
import type { CalendarEvent } from '../types';
import { Book, Map, Package, Ticket } from 'lucide-react';

interface CalendarEventProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, element: HTMLElement) => void;
}

export function CalendarEvent({ event, onClick }: CalendarEventProps) {
    const getEventIcon = () => {
      switch(event.type) {
        case 'rental': return <Package size={14} />;
        case 'tour': return <Map size={14} />;
        case 'lesson': return <Book size={14} />;
        case 'ticket': return <Ticket size={14} />;
        default: return null;
      }
    };
    const getStatusColor = (status: string) => {
        switch(status) {
          case 'available': return 'success.main';
          case 'booked': return 'warning.main';
          case 'cancelled': return 'error.main';
          default: return 'primary.main';
        }
      };
    
      const renderEventDetails = () => {
        if (!event.metadata?.data) return null;
    
        switch (event.metadata.type) {
          case 'rental':
            const rentalData = event.metadata.data;
            return `${rentalData.itemName} ${rentalData.current ? `(${rentalData.current}/${rentalData.total || '-'})` : ''}`;
            
          case 'tour':
            const tourData = event.metadata.data;
            return `${tourData.current}/${tourData.capacity} participants`;
            
          case 'lesson':
            const lessonData = event.metadata.data;
            return `Instructor: ${lessonData.instructor} (${lessonData.current}/${lessonData.maxStudents})`;
            
          case 'ticket':
            const ticketData = event.metadata.data;
            return `${ticketData.current}/${ticketData.capacity} sold`;
            
          default:
            return null;
        }
      };
    
      return (
        <Box
          sx={{
            backgroundColor: getStatusColor(event.status),
            color: 'white',
            p: 1,
            borderRadius: 1,
            mb: 0.5,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
          onClick={(e) => onClick(event, e.currentTarget)}
        >
          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
            {getEventIcon()}
            <Typography variant="caption" noWrap fontWeight="medium">
              {event.title}
            </Typography>
          </Box>
    
          <Typography variant="caption" component="div" sx={{ opacity: 0.9 }}>
            {renderEventDetails()}
          </Typography>
        </Box>
      );
    }