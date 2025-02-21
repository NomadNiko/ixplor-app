import { useState } from 'react';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import { StaffUser, CreateStaffUserDto, ShiftObject } from './types';

export function useStaffUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStaffUser = async (data: CreateStaffUserDto): Promise<StaffUser> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/staff-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create staff user');
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

  const getStaffUsersByVendor = async (vendorId: string): Promise<StaffUser[]> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/staff-users/vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch staff users');
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

  const addShift = async (staffId: string, shift: Omit<ShiftObject, '_id'>): Promise<StaffUser> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/staff-users/${staffId}/shifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(shift),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add shift');
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

  const addQualification = async (
    staffId: string,
    bookingItemId: string
  ): Promise<StaffUser> => {
    try {
      setLoading(true);
      setError(null);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URL}/staff-users/${staffId}/qualifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ bookingItemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add qualification');
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
    createStaffUser,
    getStaffUsersByVendor,
    addShift,
    addQualification,
  };
}