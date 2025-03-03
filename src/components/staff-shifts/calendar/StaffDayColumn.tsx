import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { format, parseISO } from 'date-fns';
import { alpha, useTheme } from '@mui/material/styles';
import { StaffShift } from './StaffWeeklyCalendar';
import { Clock, User } from 'lucide-react';

interface StaffDayColumnProps {
  date: Date;
  shifts: StaffShift[];
  onShiftClick: (shift: StaffShift) => void;
  isToday: boolean;
}

export default function StaffDayColumn({
  date,
  shifts,
  onShiftClick,
  isToday
}: StaffDayColumnProps) {
  const theme = useTheme();

  // Sort shifts by start time
  const sortedShifts = [...shifts].sort((a, b) => {
    const dateA = parseISO(a.startDateTime);
    const dateB = parseISO(b.startDateTime);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Box sx={{
      flex: 1,
      minWidth: 0,
      height: '100%',
      borderRight: 1,
      borderColor: 'divider',
      '&:last-child': {
        borderRight: 0,
      }
    }}>
      <Box sx={{
        p: 1,
        textAlign: 'center',
        bgcolor: theme => isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Typography variant="subtitle2">{format(date, 'EEE')}</Typography>
        <Typography variant="h6" color={isToday ? "primary" : "text.primary"}>
          {format(date, 'd')}
        </Typography>
      </Box>
      <Box sx={{ 
        height: 'calc(100% - 70px)', 
        overflow: 'auto', 
        p: 1,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.text.secondary, 0.3),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: alpha(theme.palette.text.secondary, 0.5),
        }
      }}>
        {sortedShifts.map((shift) => (
          <Paper
            key={shift._id}
            onClick={() => onShiftClick(shift)}
            sx={{
              p: 1.5,
              mb: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1 
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <Clock 
                  size={16} 
                  color={theme.palette.text.secondary} 
                  style={{ flexShrink: 0 }} 
                />
                <Typography 
                  variant="body2" 
                  color="text.primary"
                  sx={{ fontWeight: 500 }}
                >
                  {format(parseISO(shift.startDateTime), 'h:mm a')} - 
                  {format(parseISO(shift.endDateTime), 'h:mm a')}
                </Typography>
              </Box>
              
              {shift.staffName && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  pl: '24px' // Align with clock icon
                }}>
                  <User 
                    size={16} 
                    color={theme.palette.text.secondary} 
                    style={{ flexShrink: 0 }} 
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                  >
                    {shift.staffName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
        {sortedShifts.length === 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              p: 2,
              opacity: 0.7 
            }}
          >
            No shifts
          </Typography>
        )}
      </Box>
    </Box>
  );
}