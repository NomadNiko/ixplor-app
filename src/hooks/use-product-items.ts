import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';

interface UseProductItemsOptions {
  vendorId?: string;
  templateId?: string;
  filterStatus?: ProductItemStatus;
  startDate?: Date;
  endDate?: Date;
}

export function useProductItems(options: UseProductItemsOptions = {}) {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("product-items");

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }

      let endpoint = `${API_URL}/product-items`;
      
      // Build query parameters based on options
      const params = new URLSearchParams();
      if (options.vendorId) {
        endpoint = `${API_URL}/product-items/by-vendor/${options.vendorId}`;
      }
      if (options.templateId) {
        endpoint = `${API_URL}/product-items/by-template/${options.templateId}`;
      }
      if (options.filterStatus) {
        params.append('status', options.filterStatus);
      }
      if (options.startDate) {
        params.append('startDate', options.startDate.toISOString());
      }
      if (options.endDate) {
        params.append('endDate', options.endDate.toISOString());
      }

      const queryString = params.toString();
      const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await fetch(finalEndpoint, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product items');
      }

      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      enqueueSnackbar(t("errors.loadFailed"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [options, enqueueSnackbar, t]);

  const updateItemStatus = async (itemId: string, newStatus: ProductItemStatus) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/product-items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await loadItems(); // Refresh the items list
      enqueueSnackbar(t("success.statusUpdated"), { variant: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    }
  };

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/product-items/${itemId}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await loadItems(); // Refresh the items list
      enqueueSnackbar(t("success.quantityUpdated"), { variant: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    }
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    refreshItems: loadItems,
    updateItemStatus,
    updateItemQuantity
  };
}