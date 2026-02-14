import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
  const { equipment, staff, requests, user, logout } = useApp();

  const availableEquipment = equipment.filter(
    (eq) => eq.status === "available",
  ).length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const availableStaff = staff.filter((s) => s.status === "available").length;

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
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

        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <Card className=" hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">
                  Available Equipment
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {availableEquipment}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">
                  Pending Requests
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {pendingRequests}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  Active Staff
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {availableStaff}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-blue-50 hover:scale-110 transition-all duration-300 hover:text-blue-600"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-purple-50 hover:scale-110 transition-all duration-300 hover:text-purple-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {onNewRequest && (
              <Button
                variant="outline"
                size="icon"
                onClick={onNewRequest}
                className="hover:bg-green-50 hover:scale-110 transition-all duration-300 hover:text-green-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
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
                  className="hover:bg-red-50 hover:scale-110 transition-all duration-300 hover:text-red-600"
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
        {navItems.map((item, index) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "hover:bg-gray-100 hover:scale-105"
            }`}
            style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </header>
  );
}
