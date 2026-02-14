import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RequestsPage from "./pages/RequestsPage";
import EquipmentPage from "./pages/EquipmentPage";
import StaffPage from "./pages/StaffPage";
import FloorManagementPage from "./pages/FloorManagementPage";
import NotFound from "./pages/NotFound";
import { useAppContext } from "./context/AppContext";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: () => (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests",
    Component: () => (
      <ProtectedRoute>
        <RequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment",
    Component: () => (
      <ProtectedRoute>
        <EquipmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff",
    Component: () => (
      <ProtectedRoute>
        <StaffPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/floors",
    Component: () => (
      <ProtectedRoute>
        <FloorManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
