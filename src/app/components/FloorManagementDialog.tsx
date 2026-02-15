import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FloorConfig, Zone } from "../types/floor-config";
import {
  Plus,
  Trash2,
  Edit2,
  Layers,
  Save,
  X,
  Building2,
  MapPin,
  Grid3x3,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface FloorManagementDialogProps {
  open: boolean;
  onClose: () => void;
  floors: FloorConfig[];
  onUpdateFloors: (floors: FloorConfig[]) => void;
}

export function FloorManagementDialog({
  open,
  onClose,
  floors,
  onUpdateFloors,
}: FloorManagementDialogProps) {
  const [localFloors, setLocalFloors] = useState<FloorConfig[]>(floors);
  const [editingFloor, setEditingFloor] = useState<FloorConfig | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Sync state when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalFloors(floors);
      setEditingFloor(null);
      setActiveTab("overview");
    }
  }, [open, floors]);

  const handleDeleteFloor = (floorId: string) => {
    if (localFloors.length <= 1) {
      toast.error("Cannot delete the last floor");
      return;
    }

    const updatedFloors = localFloors.filter((f) => f.id !== floorId);
    setLocalFloors(updatedFloors);

    // If the deleted floor was being edited, clear it and go back to overview
    if (editingFloor?.id === floorId) {
      setEditingFloor(null);
      setActiveTab("overview");
    }

    toast.success("Floor deleted successfully");
  };

  const handleToggleFloor = (floorId: string) => {
    setLocalFloors(
      localFloors.map((f) =>
        f.id === floorId ? { ...f, enabled: !f.enabled } : f,
      ),
    );
  };

  const handleEditFloor = (floor: FloorConfig) => {
    setEditingFloor(floor);
    setActiveTab("edit");
  };

  const handleSaveFloor = () => {
    if (!editingFloor) return;

    const updatedFloors = localFloors.map((f) =>
      f.id === editingFloor.id ? editingFloor : f,
    );

    setLocalFloors(updatedFloors);
    onUpdateFloors(updatedFloors);
    toast.success("Floor updated");
    setEditingFloor(null);
    setActiveTab("overview");
  };

  const handleSaveAll = () => {
    const updatedFloors = editingFloor
      ? localFloors.map((f) => (f.id === editingFloor.id ? editingFloor : f))
      : localFloors;

    setLocalFloors(updatedFloors);
    onUpdateFloors(updatedFloors);
    toast.success("Floor configuration saved");
    onClose();
  };

  const handleAddZone = () => {
    if (!editingFloor) return;

    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: "New Zone",
      color: "#3b82f6",
      capacity: 10,
      bounds: {
        x: 50 + editingFloor.zones.length * 20,
        y: 50 + editingFloor.zones.length * 20,
        width: 150,
        height: 150,
      },
    };

    setEditingFloor({
      ...editingFloor,
      zones: [...editingFloor.zones, newZone],
    });
  };

  const handleUpdateZone = (zoneId: string, updates: Partial<Zone>) => {
    if (!editingFloor) return;

    setEditingFloor({
      ...editingFloor,
      zones: editingFloor.zones.map((z) => {
        if (z.id === zoneId) {
          const updatedZone = { ...z, ...updates };
          // Ensure bounds always has all required properties
          if (updates.bounds) {
            updatedZone.bounds = {
              x: updates.bounds.x ?? z.bounds?.x ?? 0,
              y: updates.bounds.y ?? z.bounds?.y ?? 0,
              width: updates.bounds.width ?? z.bounds?.width ?? 100,
              height: updates.bounds.height ?? z.bounds?.height ?? 100,
            };
          }
          return updatedZone;
        }
        return z;
      }),
    });
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!editingFloor) return;

    setEditingFloor({
      ...editingFloor,
      zones: editingFloor.zones.filter((z) => z.id !== zoneId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Floor Management
          </DialogTitle>
          <DialogDescription>
            Configure hospital floors, zones, and layouts for your facility
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              <Layers className="h-4 w-4 mr-2" />
              Floor Overview
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingFloor}>
              <Edit2 className="h-4 w-4 mr-2" />
              {editingFloor ? `Edit ${editingFloor.name}` : "Edit Floor"}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto mt-4">
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {localFloors
                    .sort((a, b) => a.number - b.number)
                    .map((floor) => (
                      <Card
                        key={floor.id}
                        className={!floor.enabled ? "opacity-50" : ""}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-base">
                                  {floor.name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Floor {floor.number} • {floor.zones.length}{" "}
                                  zones
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFloor(floor.id)}
                              >
                                {floor.enabled ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditFloor(floor)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFloor(floor.id)}
                                disabled={localFloors.length <= 1}
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {floor.zones.map((zone) => (
                              <Badge
                                key={zone.id}
                                variant="secondary"
                                style={{
                                  backgroundColor: zone.color + "20",
                                  color: zone.color,
                                }}
                              >
                                {zone.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="flex-1 overflow-y-auto mt-4">
            {editingFloor && (
              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1">
                  <div className="space-y-6 pr-4">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Floor Number</Label>
                            <Input
                              type="number"
                              value={editingFloor.number}
                              onChange={(e) =>
                                setEditingFloor({
                                  ...editingFloor,
                                  number: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Floor Name</Label>
                            <Input
                              value={editingFloor.name}
                              onChange={(e) =>
                                setEditingFloor({
                                  ...editingFloor,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Map Width (px)</Label>
                            <Input
                              type="number"
                              value={editingFloor.dimensions.width}
                              onChange={(e) =>
                                setEditingFloor({
                                  ...editingFloor,
                                  dimensions: {
                                    ...editingFloor.dimensions,
                                    width: parseInt(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Map Height (px)</Label>
                            <Input
                              type="number"
                              value={editingFloor.dimensions.height}
                              onChange={(e) =>
                                setEditingFloor({
                                  ...editingFloor,
                                  dimensions: {
                                    ...editingFloor.dimensions,
                                    height: parseInt(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Zones */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Grid3x3 className="h-4 w-4" />
                            Zones Management
                          </CardTitle>
                          <Button
                            size="sm"
                            onClick={handleAddZone}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Zone
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingFloor.zones.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Grid3x3 className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              No zones added yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Click "Add Zone" to get started
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4 h-auto overflow-y-auto">
                            {editingFloor.zones.map((zone, index) => (
                              <div
                                key={zone.id}
                                className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100/50"
                              >
                                {/* Zone Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-6 h-6 rounded border-2"
                                      style={{
                                        backgroundColor: zone.color + "40",
                                        borderColor: zone.color,
                                      }}
                                    />
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {zone.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Zone {index + 1}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteZone(zone.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Zone Details Grid */}
                                <div className="space-y-4">
                                  {/* Basic Info Row */}
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium">
                                        Zone Name
                                      </Label>
                                      <Input
                                        value={zone.name}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            name: e.target.value,
                                          })
                                        }
                                        placeholder="e.g., Emergency"
                                        className="h-9"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium">
                                        Color
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="color"
                                          value={zone.color}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              color: e.target.value,
                                            })
                                          }
                                          className="w-12 h-9 p-1 cursor-pointer"
                                        />
                                        <Input
                                          value={zone.color}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              color: e.target.value,
                                            })
                                          }
                                          placeholder="#3b82f6"
                                          className="flex-1 h-9 text-xs font-mono"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium">
                                        Capacity
                                      </Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={zone.capacity}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            capacity: parseInt(e.target.value),
                                          })
                                        }
                                        placeholder="10"
                                        className="h-9"
                                      />
                                    </div>
                                  </div>

                                  {/* Position & Size */}
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-3">
                                      Position & Size
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                      <div className="space-y-2">
                                        <Label className="text-xs">
                                          X Position
                                        </Label>
                                        <Input
                                          type="number"
                                          value={zone.bounds?.x ?? 0}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              bounds: {
                                                x:
                                                  parseInt(e.target.value) || 0,
                                                y: zone.bounds?.y ?? 0,
                                                width:
                                                  zone.bounds?.width ?? 100,
                                                height:
                                                  zone.bounds?.height ?? 100,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs">
                                          Y Position
                                        </Label>
                                        <Input
                                          type="number"
                                          value={zone.bounds?.y ?? 0}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              bounds: {
                                                x: zone.bounds?.x ?? 0,
                                                y:
                                                  parseInt(e.target.value) || 0,
                                                width:
                                                  zone.bounds?.width ?? 100,
                                                height:
                                                  zone.bounds?.height ?? 100,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs">Width</Label>
                                        <Input
                                          type="number"
                                          value={zone.bounds?.width ?? 100}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              bounds: {
                                                x: zone.bounds?.x ?? 0,
                                                y: zone.bounds?.y ?? 0,
                                                width:
                                                  parseInt(e.target.value) ||
                                                  100,
                                                height:
                                                  zone.bounds?.height ?? 100,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs">
                                          Height
                                        </Label>
                                        <Input
                                          type="number"
                                          value={zone.bounds?.height ?? 100}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, {
                                              bounds: {
                                                x: zone.bounds?.x ?? 0,
                                                y: zone.bounds?.y ?? 0,
                                                width:
                                                  zone.bounds?.width ?? 100,
                                                height:
                                                  parseInt(e.target.value) ||
                                                  100,
                                              },
                                            })
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>

                {/* <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingFloor(null);
                      setActiveTab("overview");
                    }}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveFloor} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save Floor
                  </Button>
                </div> */}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSaveAll} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
