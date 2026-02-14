import React, { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { FloorManagementDialog } from "../components/FloorManagementDialog";
import { AddAccessPointDialog } from "../components/AddAccessPointDialog";
import { TransportMap } from "../components/TransportMap";
import { ZoneStatistics } from "../components/ZoneStatistics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plus, Edit, Layers, Building2, Radio } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FloorManagementPage() {
  const {
    floorConfig,
    equipment,
    staff,
    accessPoints,
    selectedFloor,
    setSelectedFloor,
    handleFloorConfigUpdate,
    handleAddAccessPoint,
  } = useApp();

  const [showFloorDialog, setShowFloorDialog] = useState(false);
  const [showAccessPointDialog, setShowAccessPointDialog] = useState(false);

  const enabledFloors = floorConfig
    .filter((f) => f.enabled)
    .sort((a, b) => a.number - b.number);
  const currentFloor = floorConfig.find((f) => f.number === selectedFloor);

  const floorsAPs = accessPoints.filter(
    (ap) => ap.location.floor === selectedFloor,
  );
  const totalAPs = accessPoints.length;
  const zonesCount = currentFloor?.zones?.length || 0;

  return (
    
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Floor & Zone Management
            </h2>
            <p className="text-muted-foreground">
              Configure floors, zones, and access points
            </p>
          </div>
          <Button onClick={() => setShowFloorDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Floor Configuration
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Floors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enabledFloors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Access Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalAPs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Floor Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {zonesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Floor APs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {floorsAPs.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floor Selector */}
        <div className="bg-white border rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Select Floor:</span>
              {enabledFloors.map((floor) => (
                <Button
                  key={floor.id}
                  variant={
                    selectedFloor === floor.number ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedFloor(floor.number)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccessPointDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Access Point
            </Button>
          </div>
        </div>

        {/* Floor Details */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Map */}
          <div className="flex-1">
            <TransportMap
              equipment={equipment}
              staff={staff}
              accessPoints={accessPoints}
              selectedFloor={selectedFloor}
              floorConfig={floorConfig}
              onEquipmentClick={() => {}}
              onStaffClick={() => {}}
              onAccessPointClick={() => {}}
            />
          </div>

          {/* Right Panel */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Current Floor Info */}
            {currentFloor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {currentFloor.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Floor Number
                    </div>
                    <div className="font-semibold">{currentFloor.number}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Dimensions
                    </div>
                    <div className="text-sm">100 x 100 units</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Zones
                    </div>
                    <div className="space-y-1">
                      {currentFloor.zones?.map((zone) => (
                        <Badge
                          key={zone.id}
                          variant="secondary"
                          className="mr-1 mb-1"
                        >
                          {zone.name}
                        </Badge>
                      ))}
                      {(!currentFloor.zones ||
                        currentFloor.zones.length === 0) && (
                        <span className="text-xs text-muted-foreground">
                          No zones configured
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Zone Statistics */}
            <ZoneStatistics
              equipment={equipment}
              staff={staff}
              selectedFloor={selectedFloor}
              floorConfig={floorConfig}
            />

            {/* Access Points on Floor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Access Points ({floorsAPs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {floorsAPs.map((ap) => (
                    <div
                      key={ap.id}
                      className="flex items-center justify-between p-2 border rounded text-xs"
                    >
                      <div>
                        <div className="font-medium">{ap.name}</div>
                        <div className="text-muted-foreground">{ap.model}</div>
                      </div>
                      <Badge
                        variant={
                          ap.status === "online" ? "default" : "secondary"
                        }
                      >
                        {ap.status}
                      </Badge>
                    </div>
                  ))}
                  {floorsAPs.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No access points on this floor
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FloorManagementDialog
        open={showFloorDialog}
        onClose={() => setShowFloorDialog(false)}
        floors={floorConfig}
        onUpdateFloors={(newConfig) => {
          handleFloorConfigUpdate(newConfig);
          setShowFloorDialog(false);
        }}
      />

      <AddAccessPointDialog
        open={showAccessPointDialog}
        onClose={() => setShowAccessPointDialog(false)}
        onAddAccessPoint={(data) => {
          handleAddAccessPoint(data);
          setShowAccessPointDialog(false);
        }}
        floorConfigs={floorConfig}
      />
    </div>
  );
}
