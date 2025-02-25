import { useState, useCallback } from 'react';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { format } from 'date-fns';

interface AvailabilityResponse {
  availableTimeSlots: Date[];
  totalSlots: number;
  slotsBreakdown: Record<string, number>;
  availableStaffIds?: string[];
}

export const useBookingAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAvailableSlots = useCallback(async (
    bookingItemId: string,
    date: Date
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const tokensInfo = getTokensInfo();
      
      if (!tokensInfo?.token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${API_URL}/booking-availability/${bookingItemId}/date/${formattedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data: AvailabilityResponse = await response.json();
      
      // Convert the dates to time strings (HH:mm format)
      const timeSlots = data.availableTimeSlots.map(slot => 
        format(new Date(slot), 'HH:mm')
      ).sort();

      return timeSlots;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check availability';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const validateTimeSlot = useCallback(async (
    bookingItemId: string,
    startDateTime: Date,
    duration: number
  ): Promise<boolean> => {
    try {
      const tokensInfo = getTokensInfo();
      
      if (!tokensInfo?.token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${API_URL}/booking-availability/validate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bookingItemId,
            startDateTime: startDateTime.toISOString(),
            duration
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to validate time slot');
      }

      const data = await response.json();
      return data.isAvailable;
    } catch (err) {
      console.error('Error validating time slot:', err);
      return false;
    }
  }, []);

  return {
    getAvailableSlots,
    validateTimeSlot,
    loading,
    error
  };
};