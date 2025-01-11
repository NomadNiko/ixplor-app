export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  type: 'tour' | 'lesson' | 'rental' | 'ticket';
  status: 'available' | 'booked' | 'requested' | 'cancelled';
  metadata?: EventMetadata;
}

export interface BaseEventMetadata {
  price?: number;
  notes?: string;
  location?: string;
}

export interface TourEventMetadata extends BaseEventMetadata {
    current: number;
    capacity: number;
    guide?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    meetingPoint?: string;
    includes?: string[];
  }
  
  export interface LessonEventMetadata extends BaseEventMetadata {
    instructor: string;
    current: number;
    maxStudents: number;
    expertise: string;
    languages: string[];
    requirements?: string;
  }
  
  export interface RentalEventMetadata extends BaseEventMetadata {
    itemName: string;
    size?: string;
    condition?: string;
    pickupLocation?: string;
    returnLocation?: string;
    maintenanceNotes?: string;
    current?: number;
    total?: number;
  }
  
  export interface TicketEventMetadata extends BaseEventMetadata {
    type: 'season-pass' | 'day-pass' | 'multi-day' | 'half-day';
    current: number;
    capacity: number;
    validity: {
      start: string;
      end: string;
    };
    benefits?: string[];
    restrictions?: string;
  }
export type EventMetadata = 
  | { type: 'tour'; data: TourEventMetadata }
  | { type: 'lesson'; data: LessonEventMetadata }
  | { type: 'rental'; data: RentalEventMetadata }
  | { type: 'ticket'; data: TicketEventMetadata };

export interface CalendarViewProps {
  events: CalendarEvent[];
  initialView?: CalendarView;
  initialDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  height?: string | number;
}

export interface DateRange {
  start: Date;
  end: Date;
  days: Date[];
}

export interface EventPopoverData {
  event: CalendarEvent;
  element: HTMLElement;
}