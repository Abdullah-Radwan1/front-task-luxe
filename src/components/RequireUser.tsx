import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

export function RequireUser() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // not logged in at all
    navigate({ to: "/login" });
    return null;
  }

  // admins should be redirected to the admin panel instead of browsing customer pages
  if (user?.role === "admin") {
    navigate({ to: "/admin" });
    return null;
  }

  // render whatever nested routes are defined
  return <Outlet />;
}
