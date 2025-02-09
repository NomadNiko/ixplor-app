// PublicWeeklyCalendar.tsx
import { useEffect, useState } from 'react';
import { format, isWithinInterval, startOfDay, eachDayOfInterval, isToday } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ProductItem } from '@/app/[language]/types/product-item';
import PublicDayColumn from './PublicDayColumn';

interface PublicWeeklyCalendarProps {
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
  currentWeek: {
    start: Date;
    end: Date;
  };
}

export function PublicWeeklyCalendar({ 
  items, 
  onItemClick, 
  currentWeek,
}: PublicWeeklyCalendarProps) {
  const [groupedItems, setGroupedItems] = useState<Map<string, ProductItem[]>>(new Map());

  useEffect(() => {
    const now = new Date();
    const itemMap = new Map<string, ProductItem[]>();
    
    items.forEach(item => {
      if (item.itemStatus !== 'PUBLISHED') return;
      
      const itemDate = new Date(item.productDate);
      if (startOfDay(itemDate) < startOfDay(now)) return;
      
      if (!isWithinInterval(itemDate, { start: currentWeek.start, end: currentWeek.end })) return;
      
      const dateKey = format(itemDate, 'yyyy-MM-dd');
      if (!itemMap.has(dateKey)) {
        itemMap.set(dateKey, []);
      }
      itemMap.get(dateKey)?.push(item);
    });

    // Sort items by time for each day
    itemMap.forEach((dayItems, date) => {
      itemMap.set(date, dayItems.sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ));
    });

    setGroupedItems(itemMap);
  }, [items, currentWeek]);

  const weekDays = eachDayOfInterval({
    start: currentWeek.start,
    end: currentWeek.end
  });

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
        overflow: 'auto',
        '& > *': {
          flex: { xs: '0 0 auto', sm: 1 },
          minHeight: { xs: 300, sm: 'auto' },
          borderRight: { xs: 0, sm: 1 },
          borderBottom: { xs: 1, sm: 0 },
          borderColor: 'divider',
          '&:last-child': {
            borderRight: 0,
            borderBottom: 0
          }
        }
      }}>
        {weekDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <PublicDayColumn
              key={dateKey}
              date={day}
              items={groupedItems.get(dateKey) || []}
              onItemClick={onItemClick}
              isToday={isToday(day)}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default PublicWeeklyCalendar;