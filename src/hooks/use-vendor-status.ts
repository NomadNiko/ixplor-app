import { useState, useEffect } from 'react';
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from '@/services/i18n/client';
import { VendorStatus } from '@/types/vendor-status';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';

export function useVendorStatus(userId: string) {
  const [vendor, setVendor] = useState<VendorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("vendor-status");

  useEffect(() => {
    const loadVendorStatus = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token');
        }

        const response = await fetch(`${API_URL}/v1/vendors/user/${userId}/owned`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch vendor status');
        const data = await response.json();
        setVendor(data.data[0]);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        enqueueSnackbar(t('errors.fetchFailed'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadVendorStatus();
    }
  }, [userId, enqueueSnackbar, t]);

  return { vendor, loading, error };
}