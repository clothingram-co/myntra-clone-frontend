import { useState, useCallback } from 'react';
import { cartApi } from '../services/api/cart';
import { CartItem, AddToCartRequest } from '../types/cart';
import { showErrorToast } from '../utils/handleError';
import { toast } from 'sonner';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cartApi.fetchCart();
      setItems(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (request: AddToCartRequest) => {
    setIsLoading(true);
    try {
      const response = await cartApi.addToCart(request);
      setItems(response.items);
      setTotal(response.total);
      toast.success('Item added to cart!');
      return response;
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const response = await cartApi.updateCartItem(itemId, { quantity });
      setItems(response.items);
      setTotal(response.total);
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    try {
      const response = await cartApi.removeCartItem(itemId);
      setItems(response.items);
      setTotal(response.total);
      toast.success('Item removed from cart');
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await cartApi.clearCart();
      setItems([]);
      setTotal(0);
      toast.success('Cart cleared');
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return {
    items,
    total,
    isLoading,
    itemCount: getItemCount(),
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
