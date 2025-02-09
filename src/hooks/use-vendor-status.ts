// In hooks/use-vendor-status.ts

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

  const loadVendorStatus = async () => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      // Get owned vendors
      const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${userId}/owned`, {
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });
      
      if (!vendorResponse.ok) throw new Error('Failed to fetch vendor status');
      const vendorData = await vendorResponse.json();

      if (vendorData.data.length > 0) {
        const currentVendor = vendorData.data[0];

        
        // Check for templates
        const templatesResponse = await fetch(`${API_URL}/product-templates/by-vendor/${currentVendor._id}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!templatesResponse.ok) throw new Error('Failed to fetch templates');
        const templatesData = await templatesResponse.json();

        
        // Check for product items
        const productsResponse = await fetch(`${API_URL}/product-items/by-vendor/${currentVendor._id}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();

        setVendor({
          ...currentVendor,
          hasTemplates: templatesData.data.length > 0,
          hasProducts: productsData.data.length > 0
        });
      }
      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      enqueueSnackbar(t('errors.fetchFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadVendorStatus();
    }
  }, [userId]);

  const refreshStatus = async () => {
    setLoading(true);
    await loadVendorStatus();
  };

  return { vendor, loading, error, refreshStatus };
}