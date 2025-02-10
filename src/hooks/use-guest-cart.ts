import { useState, useEffect } from 'react';
import { useCartQuery } from '@/hooks/use-cart-query';
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from '@/services/i18n/client';
import useAuth from '@/services/auth/use-auth';
import { useAddToCartService } from '@/services/api/services/cart';
import { API_URL } from "@/services/api/config";

interface GuestCartItem {
  productItemId: string;
  productName: string;
  templateId: string;
  templateName: string;
  quantity: number;
  price: number;
  vendorId: string;
  productDate: string;
  productStartTime: string;
  productDuration: number;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  imageURL?: string;
  description?: string;
}

interface ProductItemAvailability {
  quantityAvailable: number;
  itemStatus: string;
}

interface ValidationError {
  type: 'INSUFFICIENT_QUANTITY' | 'ITEM_UNAVAILABLE' | 'TIME_CONFLICT' | 'VALIDATION_ERROR';
  message: string;
}

const GUEST_CART_KEY = 'guestCart';

export const useGuestCart = () => {
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const { user, isLoaded } = useAuth();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("cart");
  const addToCart = useAddToCartService();

  useEffect(() => {
    const savedCart = localStorage.getItem(GUEST_CART_KEY);
    if (savedCart) {
      setGuestCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (!user && guestCart.length > 0) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    }
  }, [guestCart, user]);

  const checkTimeConflicts = (
    newItem: GuestCartItem,
    existingItems: GuestCartItem[]
  ): boolean => {
    const newStart = new Date(`${newItem.productDate}T${newItem.productStartTime}`);
    const newEnd = new Date(newStart.getTime() + (newItem.productDuration * 60 * 1000));

    return existingItems.some(item => {
      const itemStart = new Date(`${item.productDate}T${item.productStartTime}`);
      const itemEnd = new Date(itemStart.getTime() + (item.productDuration * 60 * 1000));
      return (newStart < itemEnd && newEnd > itemStart);
    });
  };

  const validateInventory = async (
    productItemId: string,
    quantity: number
  ): Promise<ValidationError | null> => {
    try {
      // Use public endpoint for availability check
      const response = await fetch(`${API_URL}/product-items/${productItemId}`);
      
      if (!response.ok) {
        return { 
          type: 'ITEM_UNAVAILABLE', 
          message: t('errors.itemUnavailable') 
        };
      }

      const item: ProductItemAvailability = await response.json();

      if (item.itemStatus !== 'PUBLISHED') {
        return { 
          type: 'ITEM_UNAVAILABLE', 
          message: t('errors.itemNotActive') 
        };
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
      // If offline or error, allow the operation but warn the user
      enqueueSnackbar(t('warnings.offlineValidation'));
      return null;
    }
  };

  const addToGuestCart = async (item: GuestCartItem) => {
    try {
      // Validate inventory
      const inventoryError = await validateInventory(item.productItemId, item.quantity);
      if (inventoryError) {
        enqueueSnackbar(inventoryError.message, { variant: 'error' });
        return;
      }

      // Check time conflicts
      const hasTimeConflict = checkTimeConflicts(item, guestCart);
      if (hasTimeConflict) {
        enqueueSnackbar(t('errors.timeConflict'), { variant: 'error' });
        return;
      }

      setGuestCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(
          cartItem => cartItem.productItemId === item.productItemId
        );

        if (existingItemIndex > -1) {
          // Also validate combined quantity
          const newQuantity = prevCart[existingItemIndex].quantity + item.quantity;
          const newCart = [...prevCart];
          newCart[existingItemIndex].quantity = newQuantity;
          return newCart;
        }

        return [...prevCart, item];
      });

      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
    } catch (error) {
      console.error('Error adding to guest cart:', error);
      enqueueSnackbar(t('errors.addToCartFailed'), { variant: 'error' });
    }
  };

  const updateGuestCartItem = async (productItemId: string, quantity: number) => {
    try {
      if (quantity > 0) {
        // Only validate if increasing quantity
        const inventoryError = await validateInventory(productItemId, quantity);
        if (inventoryError) {
          enqueueSnackbar(inventoryError.message, { variant: 'error' });
          return;
        }
      }

      setGuestCart(prevCart => 
        prevCart.map(item => 
          item.productItemId === productItemId 
            ? { ...item, quantity } 
            : item
        ).filter(item => item.quantity > 0)
      );

      enqueueSnackbar(t('success.quantityUpdated'), { variant: 'success' });
    } catch (error) {
      console.error('Error updating guest cart:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    }
  };

  const removeFromGuestCart = (productItemId: string) => {
    setGuestCart(prevCart => 
      prevCart.filter(item => item.productItemId !== productItemId)
    );
    enqueueSnackbar(t('success.itemRemoved'), { variant: 'success' });
  };

  const mergeGuestCart = async () => {
    if (!user || guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        // Validate each item before merging
        const inventoryError = await validateInventory(item.productItemId, item.quantity);
        if (inventoryError) {
          enqueueSnackbar(
            t('errors.mergeFailed') + ' ' + 
            item.productName + ': ' + 
            inventoryError.message, 
            { variant: 'error' }
          );
          continue;
        }

        await addToCart({
          productItemId: item.productItemId,
          productDate: new Date(item.productDate),
          quantity: item.quantity,
          vendorId: item.vendorId,
          templateId: item.templateId,
        });
      }

      setGuestCart([]);
      localStorage.removeItem(GUEST_CART_KEY);
      refreshCart();
      enqueueSnackbar(t('success.cartMerged'), { variant: 'success' });
    } catch (error) {
      console.error('Error merging cart:', error);
      enqueueSnackbar(t('errors.mergeFailed'), { variant: 'error' });
    }
  };

  useEffect(() => {
    if (user && guestCart.length > 0) {
      mergeGuestCart();
    }
  }, [user]);

  return {
    guestCart,
    addToGuestCart,
    updateGuestCartItem,
    removeFromGuestCart,
    mergeGuestCart,
    isGuest: !user && isLoaded
  };
};

export default useGuestCart;