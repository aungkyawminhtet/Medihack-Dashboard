import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { FloorConfig, Zone } from "../types/floor-config";
import { Plus, Trash2, Grid3x3, Check, X, Building2 } from "lucide-react";
import { toast } from "sonner";

interface AddFloorDialogProps {
  open: boolean;
  onClose: () => void;
  onAddFloor: (floor: FloorConfig) => void;
  existingFloors: FloorConfig[];
}

export function AddFloorDialog({
  open,
  onClose,
  onAddFloor,
  existingFloors,
}: AddFloorDialogProps) {
  const [newFloor, setNewFloor] = useState<FloorConfig | null>(null);

  const handleCreateFloor = () => {
    const newFloorNumber =
      Math.max(...existingFloors.map((f) => f.number), -1) + 1;
    const floor: FloorConfig = {
      id: `floor-${Date.now()}`,
      number: newFloorNumber,
      name: `Floor ${newFloorNumber}`,
      zones: [],
      dimensions: { width: 1000, height: 600 },
      enabled: true,
    };
    setNewFloor(floor);
  };

  const handleAddZone = () => {
    if (!newFloor) return;

    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: "New Zone",
      color: "#3b82f6",
      capacity: 10,
      bounds: {
        x: 50 + newFloor.zones.length * 20,
        y: 50 + newFloor.zones.length * 20,
        width: 150,
        height: 150,
      },
    };

    setNewFloor({
      ...newFloor,
      zones: [...newFloor.zones, newZone],
    });
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!newFloor) return;

    setNewFloor({
      ...newFloor,
      zones: newFloor.zones.filter((z) => z.id !== zoneId),
    });
  };

  const handleUpdateZone = (zoneId: string, updates: Partial<Zone>) => {
    if (!newFloor) return;

    setNewFloor({
      ...newFloor,
      zones: newFloor.zones.map((z) => {
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

  const handleSubmit = () => {
    if (!newFloor) return;

    if (!newFloor.name.trim()) {
      toast.error("Floor name is required");
      return;
    }

    onAddFloor(newFloor);
    toast.success("Floor created successfully");
    setNewFloor(null);
    onClose();
  };

  const handleClose = () => {
    setNewFloor(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add New Floor
          </DialogTitle>
          <DialogDescription>
            Create a new floor with zones for your facility
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-6 pr-4 pb-4">
              {!newFloor ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm font-medium mb-2">
                    No floor created yet
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Click the button below to create a new floor
                  </p>
                  <Button onClick={handleCreateFloor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Floor
                  </Button>
                </div>
              ) : (
                <>
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
                            value={newFloor.number}
                            onChange={(e) =>
                              setNewFloor({
                                ...newFloor,
                                number: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Floor Name</Label>
                          <Input
                            value={newFloor.name}
                            onChange={(e) =>
                              setNewFloor({
                                ...newFloor,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Ground Floor"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Map Width (px)</Label>
                          <Input
                            type="number"
                            value={newFloor.dimensions.width}
                            onChange={(e) =>
                              setNewFloor({
                                ...newFloor,
                                dimensions: {
                                  ...newFloor.dimensions,
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
                            value={newFloor.dimensions.height}
                            onChange={(e) =>
                              setNewFloor({
                                ...newFloor,
                                dimensions: {
                                  ...newFloor.dimensions,
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
                  <Card className="flex flex-col h-96">
                    <CardHeader className="flex-shrink-0">
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
                    <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                      <ScrollArea className="h-full w-full">
                        <div className="px-6 py-4">
                          {newFloor.zones.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Grid3x3 className="h-12 w-12 text-gray-300 mb-3" />
                              <p className="text-sm text-muted-foreground">
                                No zones added yet
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click "Add Zone" to create zones for this floor
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 pr-4">
                              {newFloor.zones.map((zone, index) => (
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
                                        <div className="flex w-full">
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
                                          {/* <Input
                                            value={zone.color}
                                            onChange={(e) =>
                                              handleUpdateZone(zone.id, {
                                                color: e.target.value,
                                              })
                                            }
                                            placeholder="#3b82f6"
                                            className="flex-1 h-9 text-xs font-mono"
                                          /> */}
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
                                              capacity: parseInt(
                                                e.target.value,
                                              ),
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
                                                    parseInt(e.target.value) ||
                                                    0,
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
                                                    parseInt(e.target.value) ||
                                                    0,
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
                                            Width
                                          </Label>
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
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {newFloor && (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Create Floor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
