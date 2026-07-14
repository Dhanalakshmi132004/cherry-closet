import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  productTitle: string;
  productSlug: string;
  image: string;
  variantId: string;
  color: string | null;
  size: string | null;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem, qty = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.variantId === newItem.variantId
        );

        if (existingItem) {
          // If in stock limit is set and reached
          const maxAllowed = newItem.stock > 0 ? newItem.stock : 99;
          const updatedQty = Math.min(existingItem.quantity + qty, maxAllowed);
          set({
            items: currentItems.map((item) =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: updatedQty }
                : item
            ),
          });
        } else {
          const maxAllowed = newItem.stock > 0 ? newItem.stock : 99;
          set({
            items: [
              ...currentItems,
              { ...newItem, quantity: Math.min(qty, maxAllowed) },
            ],
          });
        }
      },
      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },
      updateQuantity: (variantId, quantity) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;
        const maxAllowed = item.stock > 0 ? item.stock : 99;
        const validQuantity = Math.max(1, Math.min(quantity, maxAllowed));
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: validQuantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'closet-cart-storage',
    }
  )
);
