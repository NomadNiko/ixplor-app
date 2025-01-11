import { parseISO, format } from 'date-fns';
import type { CalendarEvent } from '../types';

export const EVENT_COLORS = {
  tour: 'primary.main',
  lesson: 'success.main',
  rental: 'warning.main',
  ticket: 'info.main'
} as const;

export function formatEventDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, h:mm a');
}

export function getEventsByDay(events: CalendarEvent[], days: Date[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  
  days.forEach(day => {
    grouped.set(format(day, 'yyyy-MM-dd'), []);
  });

  events.forEach(event => {
    const eventDate = typeof event.start === 'string' ? 
      parseISO(event.start) : event.start;
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    
    if (grouped.has(dateKey)) {
      grouped.get(dateKey)?.push(event);
    }
  });

  return grouped;
}

export function getEventStatusColor(status: CalendarEvent['status']): 'success' | 'primary' | 'warning' {
  switch (status) {
    case 'available':
      return 'success';
    case 'booked':
      return 'primary';
    default:
      return 'warning';
  }
}