import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/mock-data";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === product.id);
          if (!exists) {
            return { items: [...state.items, product] };
          }
          return state;
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === product.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== product.id) };
          }
          return { items: [...state.items, product] };
        }),
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
      clearWishlist: () => set({ items: [] }),
      totalItems: () => get().items.length,
    }),
    { name: "wishlist-storage" },
  ),
);
