// src/types/vendor-types.ts

export type VendorStatus = "published" | "pending" | "draft";

// Equipment/Rental Types
export interface Size {
  id: string;
  label: string;
  available: number;
  total: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
}

export interface MaintenanceSchedule {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  itemCount: number;
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
  maintenanceSchedule: MaintenanceSchedule[];
}

// Ticket Types
export interface TicketProduct {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  validFrom: string;
  validTo: string;
  soldCount: number;
  availableCount: number;
  benefits: string[];
  restrictions: string;
}

// Lesson Types
export interface LessonProduct {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  price: number;
  status: string;
  expertise: string;
  languages: string[];
  maxStudents: number;
  includes: string[];
  requirements: string;
  scheduledDate?: string;
}

export interface TourSchedule {
  id: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  currentBookings: number;
  meetingPoint: string;
  guideId: string;
  weatherForecast?: {
    condition: string;
    temperature: number;
    snowCondition?: string;
    sunset?: string;
  };
  notes?: string;
}

export interface TourTemplate {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  difficulty: string;
  rating: number;
  totalReviews: number;
  seasonalAvailability: {
    startDate: string;
    endDate: string;
  };
  requirements: string[];
  includes: string[];
  meetingPoint: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    description: string;
  };
  guide: {
    id: string;
    name: string;
    photo: string;
    certifications: string[];
    experience: string;
    languages: string[];
    specialties: string[];
    availability: string;
    rating: number;
    totalTours: number;
  };
}

// TourProduct extends TourTemplate and adds schedule
export interface TourProduct extends TourTemplate {
  schedule: TourSchedule[];
}

// Main Vendor Type
export interface VendorProfileDetails {
  id: string;
  name: string;
  type: "tours" | "tickets" | "rentals" | "lessons";
  description: string;
  status: VendorStatus;
  lastUpdated: string;
  actionRequired?: string;
  tours?: TourProduct[];
  tickets?: TicketProduct[];
  rentals?: RentalProduct[];
  lessons?: LessonProduct[];
}