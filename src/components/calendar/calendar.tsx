import { useState, useCallback } from 'react';
//import { Card, CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarEvent } from './components/CalendarEvent';
import { EventPopover } from './components/EventPopover';
import { useCalendarRange, useVisibleEvents } from './hooks/useCalendarRange';
import { getEventsByDay } from './utils/eventUtils';
import type { CalendarViewProps, CalendarView, EventPopoverData, CalendarEvent as CalendarEventType } from './types';

export default function Calendar({
  events,
  initialView = 'week',
  initialDate = new Date(),
  onEventClick,
  onDateClick,
  height = '800px'
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);
  const [eventPopover, setEventPopover] = useState<EventPopoverData | null>(null);
  
  const dateRange = useCalendarRange(currentDate, view);
  const visibleEvents = useVisibleEvents(events, dateRange);
  const eventsByDay = getEventsByDay(visibleEvents, dateRange.days);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      switch (view) {
        case 'day':
          return direction === 'next' ? addDays(prev, 1) : subDays(prev, 1);
        case 'week':
          return direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1);
        case 'month':
          return direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1);
      }
    });
  }, [view]);

  const handleEventClick = useCallback((event: CalendarEventType, element: HTMLElement) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      setEventPopover({ event, element });
    }
  }, [onEventClick]);

  return (
    <Card sx={{ height }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onNavigate={navigate}
          onViewChange={setView}
        />
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          days={dateRange.days}
          eventsByDay={eventsByDay}
          onDateClick={onDateClick || (() => {})}
          renderEvent={(event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              onClick={handleEventClick}
            />
          )}
        />
        <EventPopover
          popoverData={eventPopover}
          onClose={() => setEventPopover(null)}
        />
      </CardContent>
    </Card>
  );
}