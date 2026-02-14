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
import { Plus, Building2, Layers } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    equipment,
    staff,
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
      <div className="flex-1 flex flex-col overflow-hidden p-6">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/floors")}
              className="hover:bg-purple-50 hover:scale-105 transition-all duration-300"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Manage Floors
            </Button>
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

            <Card className="shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                  onClick={() => setShowAddAccessPointDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Access Point
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-green-50 hover:scale-105 transition-all duration-300"
                  onClick={() => setShowAddEquipmentDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-purple-50 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/floors")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Zones
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-sm">Map Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                  Click on any marker to view details:
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-md" />
                    <span>Available Equipment/Staff</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-md" />
                    <span>In Use / Access Points</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-md" />
                    <span>Requested/Busy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-md" />
                    <span>Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
