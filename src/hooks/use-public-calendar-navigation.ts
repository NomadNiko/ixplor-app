import { useState, useCallback } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, isBefore } from 'date-fns';
import { WeekRange } from '../types/calendar-types';

export function usePublicCalendarNavigation() {
  const today = startOfDay(new Date());
  
  // Ensure the initial week starts from today
  const getInitialWeekRange = () => ({
    start: today,
    end: endOfWeek(today, { weekStartsOn: 0 })
  });

  const [currentWeek, setCurrentWeek] = useState<WeekRange>(getInitialWeekRange);

  const navigateToWeek = useCallback((date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    // Never allow navigation to weeks before today
    if (isBefore(weekStart, today)) {
      setCurrentWeek({
        start: today,
        end: endOfWeek(today, { weekStartsOn: 0 })
      });
    } else {
      setCurrentWeek({
        start: weekStart,
        end: endOfWeek(date, { weekStartsOn: 0 })
      });
    }
  }, [today]);

  const nextWeek = useCallback(() => {
    setCurrentWeek(prev => ({
      start: addWeeks(prev.start, 1),
      end: addWeeks(prev.end, 1)
    }));
  }, []);

  const previousWeek = useCallback(() => {
    setCurrentWeek(prev => {
      const newStart = subWeeks(prev.start, 1);
      // Prevent going before today
      if (isBefore(newStart, today)) {
        return {
          start: today,
          end: endOfWeek(today, { weekStartsOn: 0 })
        };
      }
      return {
        start: newStart,
        end: subWeeks(prev.end, 1)
      };
    });
  }, [today]);

  const goToToday = useCallback(() => {
    setCurrentWeek({
      start: today,
      end: endOfWeek(today, { weekStartsOn: 0 })
    });
  }, [today]);

  // Check if we can go to previous week
  const canGoPrevious = useCallback(() => {
    const previousStart = subWeeks(currentWeek.start, 1);
    return !isBefore(previousStart, today);
  }, [currentWeek.start, today]);

  return {
    currentWeek,
    navigateToWeek,
    nextWeek,
    previousWeek,
    goToToday,
    canGoPrevious
  };
}