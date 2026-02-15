import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
    console.log("true");
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PageTransitionLayout = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="">
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    element: <PageTransitionLayout />,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
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
    ],
  },
]);
