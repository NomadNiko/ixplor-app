import { useState } from 'react';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import { BookingItem, CreateBookingItemDto, UpdateBookingItemDto } from './types';

export function useBookingItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBookingItem = async (data: CreateBookingItemDto): Promise<BookingItem> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/booking-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking item');
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

  const getBookingItemsByVendor = async (vendorId: string): Promise<BookingItem[]> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/booking-items/vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch booking items');
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

  const updateBookingItem = async (
    id: string,
    data: UpdateBookingItemDto
  ): Promise<BookingItem> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/booking-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking item');
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

  const deleteBookingItem = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/booking-items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking item');
      }
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
    createBookingItem,
    getBookingItemsByVendor,
    updateBookingItem,
    deleteBookingItem,
  };
}