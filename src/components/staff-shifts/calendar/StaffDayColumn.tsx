import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { format } from 'date-fns';
import { alpha } from '@mui/material/styles';

interface StaffShift {
  _id: string;
  startDateTime: string;
  endDateTime: string;
}

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
  const sortedShifts = [...shifts].sort((a, b) => 
    new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );

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

      <Box sx={{ height: 'calc(100% - 70px)', overflow: 'auto', p: 1 }}>
        {sortedShifts.map((shift) => (
          <Paper
            key={shift._id}
            onClick={() => onShiftClick(shift)}
            sx={{
              p: 1,
              mb: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              }
            }}
          >
            <Typography variant="body2">
              {format(new Date(shift.startDateTime), 'h:mm a')} -
              {format(new Date(shift.endDateTime), 'h:mm a')}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}