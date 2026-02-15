import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import {
  Activity,
  Users,
  Bed,
  Building2,
  Bell,
  Settings,
  Plus,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function AppHeader({ onNewRequest }: { onNewRequest?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/requests", label: "Requests", icon: Activity },
    { path: "/equipment", label: "Equipment", icon: Bed },
    { path: "/staff", label: "Staff", icon: Users },
    { path: "/floors", label: "Floors", icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[conic-gradient(at_30%_30%,#1d4ed8,#06b6d4,#10b981)] rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-xl text-gray-900">
              Patient Transport Logistics
            </h1>
            <p className="text-sm text-gray-500">
              Smart Stretcher & Wheelchair Management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-purple-50 hover:text-purple-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 rounded-none border-b-2 px-3 ${
              location.pathname === item.path
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </header>
  );
}
