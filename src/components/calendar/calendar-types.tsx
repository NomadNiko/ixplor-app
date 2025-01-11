// // Common metadata fields shared across all event types
// interface BaseEventMetadata {
//     price?: number;
//     notes?: string;
//     location?: string;
//   }
  
//   // Type-specific metadata
//   interface TourEventMetadata extends BaseEventMetadata {
//     guide?: string;
//     capacity?: number;
//     current?: number;
//     difficulty?: 'beginner' | 'intermediate' | 'advanced';
//     meetingPoint?: string;
//     includes?: string[];
//   }
  
//   interface LessonEventMetadata extends BaseEventMetadata {
//     instructor: string;
//     maxStudents: number;
//     currentStudents?: number;
//     expertise: string;
//     languages: string[];
//     requirements?: string;
//   }
  
//   interface RentalEventMetadata extends BaseEventMetadata {
//     itemName: string;
//     size?: string;
//     condition?: string;
//     pickupLocation?: string;
//     returnLocation?: string;
//     maintenanceNotes?: string;
//   }
  
//   interface TicketEventMetadata extends BaseEventMetadata {
//     type: 'season-pass' | 'day-pass' | 'multi-day' | 'half-day';
//     validity: {
//       start: string;
//       end: string;
//     };
//     benefits?: string[];
//     restrictions?: string;
//   }
  
//   // Union type for all possible metadata types
//   type EventMetadata = 
//     | { type: 'tour'; data: TourEventMetadata }
//     | { type: 'lesson'; data: LessonEventMetadata }
//     | { type: 'rental'; data: RentalEventMetadata }
//     | { type: 'ticket'; data: TicketEventMetadata };
  
//   export interface CalendarEvent {
//     id: string;
//     title: string;
//     start: string | Date;
//     end?: string | Date;
//     type: 'tour' | 'lesson' | 'rental' | 'ticket';
//     status: 'available' | 'booked' | 'requested' | 'cancelled';
//     metadata?: EventMetadata;
//   }
  
//   export interface CalendarViewProps {
//     events: CalendarEvent[];
//     initialView?: 'day' | 'week' | 'month';
//     initialDate?: Date;
//     isDialog?: boolean;
//     onEventClick?: (event: CalendarEvent) => void;
//     onDateClick?: (date: Date) => void;
//     onRangeChange?: (start: Date, end: Date) => void;
//     height?: string | number;
//   }