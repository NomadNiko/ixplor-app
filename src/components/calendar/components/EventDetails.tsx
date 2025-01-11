import Chip from '@mui/material/Chip';
import  Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Clock, Users, DollarSign, GraduationCap, MapPin, Globe, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { CalendarEvent } from '../types';

interface EventDetailsProps {
  event: CalendarEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
    const renderMetadataItems = () => {
      if (!event.metadata) return null;
      switch (event.metadata.type) {
        case 'tour':
          const tourData = event.metadata.data;
          return (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Users size={16} />
                <Typography variant="body2">
                  {`${tourData.current}/${tourData.capacity} Participants`}
                </Typography>
              </Box>
              {tourData.guide && (
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <GraduationCap size={16} />
                  <Typography variant="body2">
                    Guide: {tourData.guide}
                  </Typography>
                </Box>
              )}
            </>
          );
  
        case 'lesson':
          const lessonData = event.metadata.data;
          return (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <GraduationCap size={16} />
                <Typography variant="body2">
                  {`Instructor: ${lessonData.instructor}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Users size={16} />
                <Typography variant="body2">
                  {`${lessonData.current}/${lessonData.maxStudents} Students`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Globe size={16} />
                <Typography variant="body2">
                  {lessonData.languages.join(', ')}
                </Typography>
              </Box>
            </>
          );
  
        case 'rental':
          const rentalData = event.metadata.data;
          return (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Tag size={16} />
                <Typography variant="body2">
                  {rentalData.itemName}
                </Typography>
              </Box>
              {rentalData.pickupLocation && (
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <MapPin size={16} />
                  <Typography variant="body2">
                    {`Pickup: ${rentalData.pickupLocation}`}
                  </Typography>
                </Box>
              )}
            </>
          );
  
        case 'ticket':
          const ticketData = event.metadata.data;
          return (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Clock size={16} />
                <Typography variant="body2">
                  {`Valid: ${format(parseISO(ticketData.validity.start), 'MMM d')} - ${format(parseISO(ticketData.validity.end), 'MMM d')}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Tag size={16} />
                <Typography variant="body2">
                  {`Type: ${ticketData.type}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Users size={16} />
                <Typography variant="body2">
                  {`${ticketData.current}/${ticketData.capacity} Sold`}
                </Typography>
              </Box>
            </>
          );
      }
    };
  
    return (
      <Box sx={{ p: 2, maxWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Clock size={16} />
          <Typography variant="body2">
            {format(
              typeof event.start === 'string' ? parseISO(event.start) : event.start,
              'MMM d, h:mm a'
            )}
          </Typography>
        </Box>
        {event.metadata?.data.price && (
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <DollarSign size={16} />
            <Typography variant="body2">
              ${event.metadata.data.price}
            </Typography>
          </Box>
        )}
        {renderMetadataItems()}
        {event.metadata?.data.location && (
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <MapPin size={16} />
            <Typography variant="body2">
              {event.metadata.data.location}
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: 1 }}>
          <Chip
            label={event.status}
            color={
              event.status === 'available' ? 'success' :
              event.status === 'booked' ? 'primary' : 'warning'
            }
            size="small"
          />
        </Box>
      </Box>
    );
  }