import { API_URL } from "../config";
import { CartItemType } from "@/app/[language]/cart/types";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export interface CartResponse {
  userId: string;
  items: CartItemType[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  productDate?: string;
  productStartTime?: string;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

export const useGetCartService = () => {
  return async () => {
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
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  };
};

export const useAddToCartService = () => {
  return async (data: AddToCartData) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensInfo.token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json();
  };
};

export const useUpdateCartItemService = () => {
  return async (data: UpdateCartItemData) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensInfo.token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return response.json();
  };
};

export const useRemoveFromCartService = () => {
  return async (productId: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/cart/item/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    return response.json();
  };
};

export const useClearCartService = () => {
  return async () => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json();
  };
};