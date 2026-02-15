import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../components/AppHeader";
import { TransportMap } from "../components/TransportMap";
import { ZoneStatistics } from "../components/ZoneStatistics";
import { NewRequestDialog } from "../components/NewRequestDialog";
import { AddEquipmentDialog } from "../components/AddEquipmentDialog";
import { AddAccessPointDialog } from "../components/AddAccessPointDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Layers, Bed, Bell, Users } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    equipment,
    staff,
    requests,
    accessPoints,
    floorConfig,
    selectedFloor,
    setSelectedFloor,
    selectedEquipment,
    setSelectedEquipment,
    selectedStaff,
    setSelectedStaff,
    selectedAccessPoint,
    setSelectedAccessPoint,
    handleNewRequest,
    handleAddEquipment,
    handleAddAccessPoint,
  } = useApp();

  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [showAddAccessPointDialog, setShowAddAccessPointDialog] =
    useState(false);

  const enabledFloors = floorConfig
    .filter((f) => f.enabled)
    .sort((a, b) => a.number - b.number);

  const availableEquipment = equipment.filter(
    (eq) => eq.status === "available",
  ).length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const availableStaff = staff.filter((s) => s.status === "available").length;

  const handleEquipmentClick = (eq: any) => {
    setSelectedEquipment(eq);
    setSelectedStaff(null);
    setSelectedAccessPoint(null);
  };

  const handleStaffClick = (s: any) => {
    setSelectedStaff(s);
    setSelectedEquipment(null);
    setSelectedAccessPoint(null);
  };

  const handleAccessPointClick = (ap: any) => {
    setSelectedAccessPoint(ap);
    setSelectedEquipment(null);
    setSelectedStaff(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader onNewRequest={() => setShowNewRequestDialog(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 animate-fadeInUpSlow">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3">
          <Card className="border border-green-100 bg-green-50/60 hover:shadow-md transition-all duration-300">
            <CardContent className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <Bed className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <div className="text-xs text-green-800/70">
                    Available Equipment
                  </div>
                  <div className="text-2xl font-semibold text-green-700">
                    {availableEquipment}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-orange-100 bg-orange-50/60 hover:shadow-md transition-all duration-300">
            <CardContent className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-orange-700" />
                </div>
                <div>
                  <div className="text-xs text-orange-800/70">
                    Pending Requests
                  </div>
                  <div className="text-2xl font-semibold text-orange-700">
                    {pendingRequests}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-blue-100 bg-blue-50/60 hover:shadow-md transition-all duration-300">
            <CardContent className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <div className="text-xs text-blue-800/70">Active Staff</div>
                  <div className="text-2xl font-semibold text-blue-700">
                    {availableStaff}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floor Selector */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Select Floor:</span>
              <div className="flex gap-2">
                {enabledFloors.map((floor, index) => (
                  <Button
                    key={floor.id}
                    variant={
                      selectedFloor === floor.number ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFloor(floor.number)}
                    className={`transition-all duration-300 ${
                      selectedFloor === floor.number
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "hover:scale-105"
                    }`}
                  >
                    {floor.name}
                  </Button>
                ))}
                {enabledFloors.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No floors configured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map and Info */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Map */}
          <div className="flex-1">
            <TransportMap
              equipment={equipment}
              staff={staff}
              accessPoints={accessPoints}
              selectedFloor={selectedFloor}
              floorConfig={floorConfig}
              onEquipmentClick={handleEquipmentClick}
              onStaffClick={handleStaffClick}
              onAccessPointClick={handleAccessPointClick}
            />
          </div>

          {/* Right Info Panel */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <div className="hover:shadow-lg transition-all duration-300 rounded-lg">
              <ZoneStatistics
                equipment={equipment}
                staff={staff}
                selectedFloor={selectedFloor}
                floorConfig={floorConfig}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NewRequestDialog
        open={showNewRequestDialog}
        onClose={() => setShowNewRequestDialog(false)}
        onAddRequest={(data) => {
          handleNewRequest(data);
          setShowNewRequestDialog(false);
        }}
      />

      <AddEquipmentDialog
        open={showAddEquipmentDialog}
        onClose={() => setShowAddEquipmentDialog(false)}
        onAddEquipment={(data) => {
          handleAddEquipment(data);
          setShowAddEquipmentDialog(false);
        }}
      />

      <AddAccessPointDialog
        open={showAddAccessPointDialog}
        onClose={() => setShowAddAccessPointDialog(false)}
        onAddAccessPoint={(data) => {
          handleAddAccessPoint(data);
          setShowAddAccessPointDialog(false);
        }}
        floorConfigs={floorConfig}
      />
    </div>
  );
}
