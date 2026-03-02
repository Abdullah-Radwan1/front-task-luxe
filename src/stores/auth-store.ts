import { create } from "zustand";
import { persist } from "zustand/middleware";
import { users } from "@/lib/mock-data"; // read/write mock users
import { useCartStore } from "./cart-store";
import { useWishlistStore } from "./wishlist-store";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: string; name?: string } | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string, password: string) => {
        const found = users.find(
          (u: any) =>
            u.email === email &&
            u.password === password &&
            u.status === "active",
        );
        if (found) {
          set({
            isAuthenticated: true,
            user: { email: found.email, role: found.role, name: found.name },
          });
          return true;
        }
        return false;
      },
      register: (name: string, email: string, password: string) => {
        if (users.some((u: any) => u.email === email)) return false;
        const id = `USR-${String(users.length + 1).padStart(3, "0")}`;
        const user = {
          id,
          name,
          email,
          password,
          role: "customer",
          status: "active",
          joinedAt: new Date().toISOString().split("T")[0],
        } as any;
        users.push(user);
        set({
          isAuthenticated: true,
          user: { email, role: "customer", name },
        });
        return true;
      },
      logout: () => {
        // clear authentication state and wipe any persisted data
        set({ isAuthenticated: false, user: null });
        try {
          localStorage.clear();
        } catch {}
        // also immediately reset other stores so UI updates right away
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
      },
    }),
    { name: "auth-storage" },
  ),
);
