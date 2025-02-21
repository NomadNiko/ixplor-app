import { BookingItemStatusEnum } from '@/types/booking-item';

// Common Types
export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// BookingItem Types
export interface BookingItem {
  _id: string;
  productName: string;
  description: string;
  imageUrl?: string;
  price: number;
  duration: number;
  vendorId: string;
  status: BookingItemStatusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingItemDto {
  productName: string;
  description: string;
  imageUrl?: string;
  price: number;
  duration: number;
  vendorId: string;
}

export interface UpdateBookingItemDto extends Partial<CreateBookingItemDto> {
  status?: BookingItemStatusEnum;
}

// Re-export BookingItemStatusEnum
export { BookingItemStatusEnum };

// StaffUser Types
export interface ShiftObject {
  _id: string;
  startDateTime: string;
  endDateTime: string;
}

export interface BookedObject {
  _id?: string;
  bookingItemId: string;
  startDateTime: string;
  duration: number;
  transactionId?: string;
  customerId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface StaffUser {
  _id: string;
  name: string;
  vendorId: string;
  qualifiedProducts: string[];
  shifts: ShiftObject[];
  bookedObjects: BookedObject[];
  status: 'ACTIVE' | 'INACTIVE';
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffUserDto {
  name: string;
  vendorId: string;
  qualifiedProducts?: string[];
  email?: string;
  phone?: string;
  notes?: string;
}