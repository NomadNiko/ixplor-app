import { Control } from 'react-hook-form';

export interface BookingFormData {
    productName: string;
    description: string;
    imageUrl?: string; 
    price: number;
    duration: number;
    status?: string;
    vendorId: string; // Add this to match CreateBookingItemDto
  }

export interface DurationPickerBookingItemsProps {
  name: string;
  label: string;
  control: Control<BookingFormData>;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}