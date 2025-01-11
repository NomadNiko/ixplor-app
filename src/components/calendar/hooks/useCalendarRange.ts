import { useMemo } from 'react';
import { 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import type { CalendarView, DateRange, CalendarEvent } from '../types';

export function useCalendarRange(currentDate: Date, view: CalendarView): DateRange {
  return useMemo(() => {
    switch (view) {
      case 'day':
        return {
          start: currentDate,
          end: currentDate,
          days: [currentDate]
        };
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return {
          start: weekStart,
          end: weekEnd,
          days: eachDayOfInterval({ start: weekStart, end: weekEnd })
        };
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return {
          start: monthStart,
          end: monthEnd,
          days: eachDayOfInterval({ start: monthStart, end: monthEnd })
        };
    }
  }, [currentDate, view]);
}

export function useVisibleEvents(events: CalendarEvent[], dateRange: DateRange) {
  return useMemo(() => {
    return events.filter(event => {
      const eventStart = typeof event.start === 'string' ? 
        parseISO(event.start) : event.start;
      const eventEnd = event.end ? 
        (typeof event.end === 'string' ? parseISO(event.end) : event.end) 
        : eventStart;
      
      return eventStart >= dateRange.start && eventEnd <= dateRange.end;
    });
  }, [events, dateRange]);
}