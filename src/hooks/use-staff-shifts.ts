import { useState, useCallback } from 'react';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export interface ShiftData {
  startDateTime: Date;
  endDateTime: Date;
}

export interface StaffShift {
  _id: string;
  startDateTime: string;
  endDateTime: string;
}

export interface BulkShiftUpdateData {
  shiftId: string;
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface UseStaffShiftsReturn {
  isLoading: boolean;
  error: string | null;
  createShifts: (staffId: string, shifts: ShiftData[]) => Promise<void>;
  updateShifts: (staffId: string, updates: BulkShiftUpdateData[]) => Promise<void>;
  deleteShifts: (staffId: string, shiftIds: string[]) => Promise<void>;
}

export function useStaffShifts(): UseStaffShiftsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShifts = useCallback(async (staffId: string, shifts: ShiftData[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const formattedShifts = shifts.map(shift => ({
        startDateTime: shift.startDateTime.toISOString(),
        endDateTime: shift.endDateTime.toISOString()
      }));

      const response = await fetch(`${API_URL}/staff-users/${staffId}/shifts/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ shifts: formattedShifts })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shifts');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateShifts = useCallback(async (staffId: string, updates: BulkShiftUpdateData[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const formattedUpdates = updates.map(update => ({
        shiftId: update.shiftId,
        startDateTime: update.startDateTime?.toISOString(),
        endDateTime: update.endDateTime?.toISOString()
      }));

      const response = await fetch(`${API_URL}/staff-users/${staffId}/shifts/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ updates: formattedUpdates })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update shifts');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteShifts = useCallback(async (staffId: string, shiftIds: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/staff-users/${staffId}/shifts/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ shiftIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete shifts');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createShifts,
    updateShifts,
    deleteShifts
  };
}