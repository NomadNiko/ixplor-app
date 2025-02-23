import { useMemo } from 'react';
import { eachDayOfInterval, format, isToday } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StaffDayColumn from './StaffDayColumn';

interface StaffShift {
  _id: string;
  startDateTime: string;
  endDateTime: string;
}

interface StaffWeeklyCalendarProps {
  shifts: StaffShift[];
  currentWeek: {
    start: Date;
    end: Date;
  };
  onShiftClick: (shift: StaffShift) => void;
}

export default function StaffWeeklyCalendar({
  shifts,
  currentWeek,
  onShiftClick
}: StaffWeeklyCalendarProps) {

  const weekDays = useMemo(() => 
    eachDayOfInterval({
      start: currentWeek.start,
      end: currentWeek.end
    }), 
    [currentWeek]
  );

  const groupedShifts = useMemo(() => {
    const shiftMap = new Map<string, StaffShift[]>();
    
    shifts.forEach(shift => {
      const dateKey = shift.startDateTime.split('T')[0];
      if (!shiftMap.has(dateKey)) {
        shiftMap.set(dateKey, []);
      }
      shiftMap.get(dateKey)?.push(shift);
    });

    return shiftMap;
  }, [shifts]);

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">
          {`${format(currentWeek.start, 'MMMM d')} - ${format(currentWeek.end, 'MMMM d, yyyy')}`}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flex: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'auto'
      }}>
        {weekDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayShifts = groupedShifts.get(dateKey) || [];

          return (
            <StaffDayColumn
              key={dateKey}
              date={day}
              shifts={dayShifts}
              onShiftClick={onShiftClick}
              isToday={isToday(day)}
            />
          );
        })}
      </Box>
    </Box>
  );
}