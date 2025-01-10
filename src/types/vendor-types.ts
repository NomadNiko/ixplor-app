export type VendorStatus = "pending" | "published" | "rejected";
export type VendorType = "rentals" | "tickets" | "lessons" | "tours";

export interface MaintenanceScheduleItem {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  itemCount: number;
}

export interface Size {
  id: string;
  label: string;
  available: number;
  total: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
}

export interface RentalProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  totalUnits: number;
  availableUnits: number;
  bookedUnits: number;
  dueOut: number;
  dueIn: number;
  sizes: Size[];
  condition: string;
  lastServiced: string;
  maintenanceSchedule: MaintenanceScheduleItem[];
}

export interface TicketProduct {
  id: string;
  name: string;
  type: "season-pass" | "day-pass" | "multi-day" | "half-day";
  description: string;
  price: number;
  validFrom: string;
  validTo: string;
  soldCount: number;
  availableCount: number;
  benefits: string[];
  restrictions: string;
}

export interface LessonProduct {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  price: number;
  status: 'available' | 'booked' | 'requested';
  scheduledDate?: string;
  expertise: string;
  languages: string[];
  maxStudents: number;
  includes: string[];
  requirements: string;
}

export interface Guide {
  name: string;
  certifications: string[];
  experience: string;
}

export interface CalendarEvent {
  id: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'cancelled';
  currentBookings: number;
  meetingPoint: string;
}

export interface TourProduct {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  requirements: string[];
  includes: string[];
  guide: Guide;
  schedule: CalendarEvent[];
}

export interface VendorProfileDetails {
  id: string;
  name: string;
  type: VendorType;
  description: string;
  status: VendorStatus;
  actionRequired?: string;
  lastUpdated: string;
  tours?: TourProduct[];
  tickets?: TicketProduct[];
  rentals?: RentalProduct[];
  lessons?: LessonProduct[];
}