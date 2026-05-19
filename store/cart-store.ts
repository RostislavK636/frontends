import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartSupplier {
  id: number;
  name: string;
}

interface CartStore {
  items: CartItem[];
  currentSupplier: CartSupplier | null;
  addItem: (item: CartItem) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setSupplier: (supplier: CartSupplier) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currentSupplier: null,

      addItem: (item: CartItem) => {
        const { currentSupplier, items } = get();

        if (currentSupplier && item.supplierId !== currentSupplier.id) {
          return false;
        }

        if (!currentSupplier) {
          set({
            currentSupplier: { id: item.supplierId, name: item.supplierName },
          });
        }

        const existingItem = items.find((i) => i.productId === item.productId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }

        return true;
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const updatedItems = items.filter((i) => i.productId !== productId);

        set({ items: updatedItems });

        if (updatedItems.length === 0) {
          set({ currentSupplier: null });
        }
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => {
        set({ items: [], currentSupplier: null });
      },

      setSupplier: (supplier: CartSupplier) => {
        set({ currentSupplier: supplier });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "agora-cart-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : memoryStorage
      ),
    }
  )
);
