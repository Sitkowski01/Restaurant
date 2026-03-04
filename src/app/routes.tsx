import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { DateTimePage } from "./pages/date-time-page";
import { TableSelectionPage } from "./pages/table-selection-page";
import { GuestDetailsPage } from "./pages/guest-details-page";
import { ConfirmationPage } from "./pages/confirmation-page";
import { PrivateEventsPage } from "./pages/private-events-page";
import { MenuPage } from "./pages/menu-page";
import { StaffLoginPage } from "./pages/staff-login-page";
import { StaffDashboardPage } from "./pages/staff-dashboard-page";
import { AdminDashboardPage } from "./pages/admin-dashboard-page";
import { ManagerDashboardPage } from "./pages/manager-dashboard-page";
import NotFoundPage from "./pages/not-found-page";

function RequireAuth({ role, children }: { role: "waiter" | "manager" | "admin"; children: React.ReactNode }) {
  const stored = sessionStorage.getItem("lmd_auth");
  if (!stored) return <Navigate to="/login" replace />;
  try {
    const auth = JSON.parse(stored);
    if (role === "admin" && auth.role !== "admin") return <Navigate to="/login" replace />;
    if (role === "manager" && !["manager", "admin"].includes(auth.role)) return <Navigate to="/login" replace />;
    if (role === "waiter" && !["waiter", "manager", "admin"].includes(auth.role)) return <Navigate to="/login" replace />;
    return <>{children}</>;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/reserve",
    Component: DateTimePage,
  },
  {
    path: "/select-table",
    Component: TableSelectionPage,
  },
  {
    path: "/guest-details",
    Component: GuestDetailsPage,
  },
  {
    path: "/confirmation",
    Component: ConfirmationPage,
  },
  {
    path: "/private-events",
    Component: PrivateEventsPage,
  },
  {
    path: "/menu",
    Component: MenuPage,
  },
  {
    path: "/login",
    Component: StaffLoginPage,
  },
  {
    path: "/staff",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/staff-dashboard",
    element: (
      <RequireAuth role="waiter">
        <StaffDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/manager",
    element: (
      <RequireAuth role="manager">
        <ManagerDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth role="admin">
        <AdminDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
