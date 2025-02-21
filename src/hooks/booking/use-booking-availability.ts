import { useState } from 'react';
import { API_URL } from '@/services/api/config';

interface TimeSlot {
  startTime: string;
  endTime: string;
  availableStaff: Array<{
    staffId: string;
    name: string;
  }>;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  alternativeSlots?: TimeSlot[];
}

export function useBookingAvailability() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAvailableTimeSlots = async (
    bookingItemId: string,
    date: string
  ): Promise<TimeSlot[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/booking-availability/${bookingItemId}?date=${date}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch available time slots');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateBookingRequest = async (
    bookingItemId: string,
    startDateTime: string,
    duration: number
  ): Promise<ValidationResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/booking-availability/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingItemId,
          startDateTime,
          duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to validate booking request');
      }

      return response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAvailableTimeSlots,
    validateBookingRequest,
  };
}