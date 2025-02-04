import { useState, useEffect } from 'react';
import { CartItemType } from '@/app/[language]/cart/types';
import { useCartQuery } from '@/hooks/use-cart-query';
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from '@/services/i18n/client';
import useAuth from '@/services/auth/use-auth';
import { useAddToCartService } from '@/services/api/services/cart';

const GUEST_CART_KEY = 'guestCart';

export const useGuestCart = () => {
  const [guestCart, setGuestCart] = useState<CartItemType[]>([]);
  const { user, isLoaded } = useAuth();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("cart");
  const addToCart = useAddToCartService();

  // Load guest cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem(GUEST_CART_KEY);
    if (savedCart) {
      setGuestCart(JSON.parse(savedCart));
    }
  }, []);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!user && guestCart.length > 0) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    }
  }, [guestCart, user]);

  // Function to add item to guest cart
  const addToGuestCart = (item: CartItemType) => {
    setGuestCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.productId === item.productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      }

      // Add new item if it doesn't exist
      return [...prevCart, item];
    });
    enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
  };

  // Function to update item quantity in guest cart
  const updateGuestCartItem = (productId: string, quantity: number) => {
    setGuestCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Function to remove item from guest cart
  const removeFromGuestCart = (productId: string) => {
    setGuestCart(prevCart => 
      prevCart.filter(item => item.productId !== productId)
    );
  };

  // Function to merge guest cart with user cart on login
  const mergeGuestCart = async () => {
    if (!user || guestCart.length === 0) return;

    try {
      // Add each guest cart item to the user's cart
      for (const item of guestCart) {
        await addToCart({
          productId: item.productId,
          quantity: item.quantity,
          vendorId: item.vendorId || "",
          productDate: item.productDate,
          productStartTime: item.productStartTime
        });
      }

      // Clear guest cart after successful merge
      setGuestCart([]);
      localStorage.removeItem(GUEST_CART_KEY);
      refreshCart();
      
      enqueueSnackbar(t('success.cartMerged'), { variant: 'success' });
    } catch (error) {
      console.error('Error merging cart:', error);
      enqueueSnackbar(t('errors.mergeFailed'), { variant: 'error' });
    }
  };

  // Attempt to merge cart when user logs in
  useEffect(() => {
    if (user && guestCart.length > 0) {
      mergeGuestCart();
    }
  }, [user, guestCart, addToCart, refreshCart, enqueueSnackbar, t]);

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