import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { useRouter } from "next/navigation";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function WeeklyCalendar() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const getEventsForDay = () => {
    return Math.random() > 0.7 ? [{
      id: 'sample',
      title: 'Sample Event',
      time: '10:00 AM',
      type: 'tour',
      status: 'available',
      vendorName: 'Sample Vendor'
    }] : [];
  };

  const nextWeek = () => setWeekStart(date => addDays(date, 7));
  const prevWeek = () => setWeekStart(date => addDays(date, -7));
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'tour': return 'primary.main';
      case 'lesson': return 'success.main';
      case 'rental': return 'warning.main';
      case 'ticket': return 'info.main';
      default: return 'text.primary';
    }
  };

  return (
    <Box className="mt-8">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <Calendar size={24} />
          Scheduled Activities
        </Typography>
        <Box>
          <IconButton onClick={prevWeek}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1" component="span" mx={2}>
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </Typography>
          <IconButton onClick={nextWeek}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box 
        display="flex" 
        gap={2}
        sx={{
          flexDirection: isMobile ? 'column' : 'row'
        }}
      >
        {days.map(day => (
          <Card
            key={day.toISOString()}
            className="flex-1 p-3"
            sx={{
              backgroundColor: isSameDay(day, new Date()) ? 'action.hover' : 'background.paper',
              minHeight: isMobile ? 'auto' : '200px'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2">
                {format(day, 'EEE')}
              </Typography>
              <Typography
                variant="h6"
                color={isSameDay(day, new Date()) ? 'primary.main' : 'text.primary'}
              >
                {format(day, 'd')}
              </Typography>
            </Box>

            <Box>
              {getEventsForDay().map(event => (
                <Card
                  key={event.id}
                  variant="outlined"
                  className="mb-2 p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/vendor`)}
                >
                  <Typography variant="caption" color={getEventColor(event.type)}>
                    {event.type.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {event.title}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {event.time}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      color={event.status === 'available' ? 'success' :
                        event.status === 'booked' ? 'primary' : 'warning'}
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default WeeklyCalendar;