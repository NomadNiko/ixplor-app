export type VendorStatus = "pending" | "published" | "rejected";
export type VendorType = "rentals" | "tickets" | "lessons" | "tours";

// Base vendor profile type
export interface VendorProfile {
  id: string;
  name: string;
  type: VendorType;
  description: string;
  status: VendorStatus;
  actionRequired?: string;
  lastUpdated: string;
}

// Type-specific interfaces
export interface TourProduct {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  schedule: CalendarEvent[];
}

export interface TicketProduct {
  id: string;
  name: string;
  type: 'day-pass' | 'season-pass' | 'multi-day';
  price: number;
  validFrom: string;
  validTo: string;
  soldCount: number;
  availableCount: number;
}

export interface RentalProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  images?: string[];
  totalUnits: number;
  availableUnits: number;
  bookedUnits: number;
  dueOut: number;
  dueIn: number;
  sizes: Array<{
    id: string;
    label: string;
    available: number;
    total: number;
    pricePerHour: number;
    pricePerDay: number;
    pricePerWeek: number;
  }>;
  condition: 'excellent' | 'good' | 'fair';
  maintenanceSchedule?: Array<{
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    itemCount: number;
  }>;
  lastServiced?: string;
}


export interface LessonProduct {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  price: number;
  status: 'available' | 'booked' | 'requested';
  scheduledDate?: string;
}

export interface CalendarEvent {
  id: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'cancelled';
}

// Extended vendor profile with type-specific details
export interface VendorProfileDetails extends VendorProfile {
  tours?: TourProduct[];
  tickets?: TicketProduct[];
  rentals?: RentalProduct[];
  lessons?: LessonProduct[];
}