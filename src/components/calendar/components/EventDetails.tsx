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
        return (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Users size={16} />
              <Typography variant="body2">
                {`${event.metadata.data.current || 0} / ${event.metadata.data.capacity || 0} Participants`}
              </Typography>
            </Box>
            {event.metadata.data.guide && (
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <GraduationCap size={16} />
                <Typography variant="body2">
                  Guide: {event.metadata.data.guide}
                </Typography>
              </Box>
            )}
          </>
        );

      case 'lesson':
        return (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <GraduationCap size={16} />
              <Typography variant="body2">
                {`Instructor: ${event.metadata.data.instructor}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Users size={16} />
              <Typography variant="body2">
                {`${event.metadata.data.currentStudents || 0} / ${event.metadata.data.maxStudents} Students`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Globe size={16} />
              <Typography variant="body2">
                {event.metadata.data.languages.join(', ')}
              </Typography>
            </Box>
          </>
        );

      case 'rental':
        return (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Tag size={16} />
              <Typography variant="body2">
                {event.metadata.data.itemName}
              </Typography>
            </Box>
            {event.metadata.data.pickupLocation && (
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <MapPin size={16} />
                <Typography variant="body2">
                  {`Pickup: ${event.metadata.data.pickupLocation}`}
                </Typography>
              </Box>
            )}
          </>
        );

      case 'ticket':
        return (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Clock size={16} />
              <Typography variant="body2">
                {`Valid: ${format(parseISO(event.metadata.data.validity.start), 'MMM d')} - ${format(parseISO(event.metadata.data.validity.end), 'MMM d')}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Tag size={16} />
              <Typography variant="body2">
                {`Type: ${event.metadata.data.type}`}
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