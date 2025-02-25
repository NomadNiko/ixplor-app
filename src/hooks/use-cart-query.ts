import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { useTranslation } from "@/services/i18n/client";
import { cartKeys } from '@/src/services/react-query/keys/cart';

export interface CartItem {
  productItemId: string;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  productImageURL?: string;
  vendorId: string;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  productDate?: string;
  productStartTime?: string;
  productDuration?: number;
  quantityAvailable?: number;
  templateId: string;
  templateName: string;
}

export interface CartResponse {
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productItemId: string;
  productDate: Date;
  quantity: number;
  vendorId: string;
  templateId: string;
}

export interface AddBookingToCartData {
  bookingItemId: string;
  startDateTime: Date;
  duration: number;
  vendorId: string;
  staffId?: string;
}

export interface UpdateCartItemData {
  productItemId: string;
  quantity: number;
}

interface ValidationError {
  type: 'INSUFFICIENT_QUANTITY' | 'ITEM_UNAVAILABLE' | 'TIME_CONFLICT' | 'VALIDATION_ERROR';
  message: string;
}

export function useCartQuery() {
  const getCart = async () => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch cart');
    }
    return response.json();
  };

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation("cart");
  const query = useQuery({
    queryKey: user ? cartKeys.root().sub.detail(user.id.toString()).key : [],
    queryFn: getCart,
    enabled: !!user,
  });

  const validateInventory = async (productItemId: string, quantity: number): Promise<ValidationError | null> => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) throw new Error('No auth token');
      const response = await fetch(`${API_URL}/product-items/${productItemId}`, {
        headers: { Authorization: `Bearer ${tokensInfo.token}` }
      });
      if (!response.ok) {
        return { type: 'ITEM_UNAVAILABLE', message: t('errors.itemUnavailable') };
      }
      const item = await response.json();
      
      if (item.itemStatus !== 'PUBLISHED') {
        return { type: 'ITEM_UNAVAILABLE', message: t('errors.itemNotActive') };
      }
      if (item.quantityAvailable < quantity) {
        return {
          type: 'INSUFFICIENT_QUANTITY',
          message: t('errors.insufficientQuantity', { available: item.quantityAvailable })
        };
      }
      return null;
    } catch (error) {
      console.error('Validation error:', error);
      return null;
    }
  };

  const checkTimeConflicts = (
    newItem: { productDate: string; productStartTime: string; productDuration: number },
    existingItems: CartItem[]
  ): ValidationError | null => {
    const newStart = new Date(`${newItem.productDate}T${newItem.productStartTime}`);
    const newEnd = new Date(newStart.getTime() + (newItem.productDuration * 60 * 1000));
    const hasConflict = existingItems.some(item => {
      if (!item.productDate || !item.productStartTime || !item.productDuration) return false;
      const itemStart = new Date(`${item.productDate}T${item.productStartTime}`);
      const itemEnd = new Date(itemStart.getTime() + (item.productDuration * 60 * 1000));
      return (newStart < itemEnd && newEnd > itemStart);
    });
    if (hasConflict) {
      return { type: 'TIME_CONFLICT', message: t('errors.timeConflict') };
    }
    return null;
  };

  const addItem = async (data: AddToCartData) => {
    try {
      const inventoryError = await validateInventory(data.productItemId, data.quantity);
      if (inventoryError) {
        throw new Error(inventoryError.message);
      }
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }
      const itemResponse = await fetch(`${API_URL}/product-items/${data.productItemId}`, {
        headers: { Authorization: `Bearer ${tokensInfo.token}` }
      });
      const itemDetails = await itemResponse.json();
      if (query.data?.items) {
        const timeConflict = checkTimeConflicts(itemDetails, query.data.items);
        if (timeConflict) {
          throw new Error(timeConflict.message);
        }
      }
      
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({
          ...data,
          productDate: new Date(data.productDate) // Convert to Date object before sending
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
      
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
      
      return response.json();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const addBookingItem = async (data: AddBookingToCartData) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }
      
      // Validate availability first
      const validationResponse = await fetch(`${API_URL}/booking-availability/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({
          bookingItemId: data.bookingItemId,
          startDateTime: data.startDateTime.toISOString(),
          duration: data.duration
        }),
      });
      
      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        throw new Error(errorData.message || 'Time slot is no longer available');
      }
      
      // Add booking to cart
      const response = await fetch(`${API_URL}/cart/add-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({
          bookingItemId: data.bookingItemId,
          startDateTime: data.startDateTime.toISOString(),
          duration: data.duration,
          vendorId: data.vendorId,
          staffId: data.staffId || undefined // Only include if provided
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add booking to cart');
      }
      
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
      
      return response.json();
    } catch (error) {
      console.error('Error adding booking to cart:', error);
      throw error;
    }
  };

  const updateItem = async (productItemId: string, quantity: number) => {
    try {
      if (quantity > 0) {
        const inventoryError = await validateInventory(productItemId, quantity);
        if (inventoryError) {
          return;
        }
      }
      
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }
      
      const response = await fetch(`${API_URL}/cart/${productItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update cart item');
      }
      
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
      
      return response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeItem = async (productItemId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }
      
      const response = await fetch(`${API_URL}/cart/${productItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }
      
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
      
      return response.json();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  const clear = async () => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }
      
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to clear cart');
      }
      
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
      
      return response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const refreshCart = () => {
    if (user) {
      queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user.id.toString()).key,
      });
    }
  };

  return {
    ...query,
    addItem,
    addBookingItem,
    updateItem,
    removeItem,
    clear,
    refreshCart,
  };
}