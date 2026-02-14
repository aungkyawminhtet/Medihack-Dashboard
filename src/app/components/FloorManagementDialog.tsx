import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FloorConfig, Zone, DEFAULT_ZONES } from '../types/floor-config';
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
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

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
  onUpdateFloors 
}: FloorManagementDialogProps) {
  const [localFloors, setLocalFloors] = useState<FloorConfig[]>(floors);
  const [editingFloor, setEditingFloor] = useState<FloorConfig | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAddFloor = () => {
    const newFloorNumber = Math.max(...localFloors.map(f => f.number), 0) + 1;
    const newFloor: FloorConfig = {
      id: `floor-${Date.now()}`,
      number: newFloorNumber,
      name: `Floor ${newFloorNumber}`,
      zones: DEFAULT_ZONES.map(zone => ({ ...zone, id: `${zone.id}-${Date.now()}` })),
      dimensions: { width: 1000, height: 600 },
      enabled: true,
    };
    setLocalFloors([...localFloors, newFloor]);
    setEditingFloor(newFloor);
    setActiveTab('edit');
  };

  const handleDeleteFloor = (floorId: string) => {
    if (localFloors.length === 1) {
      toast.error('Cannot delete the last floor');
      return;
    }
    setLocalFloors(localFloors.filter(f => f.id !== floorId));
    if (editingFloor?.id === floorId) {
      setEditingFloor(null);
    }
    toast.success('Floor deleted');
  };

  const handleToggleFloor = (floorId: string) => {
    setLocalFloors(localFloors.map(f => 
      f.id === floorId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleEditFloor = (floor: FloorConfig) => {
    setEditingFloor(floor);
    setActiveTab('edit');
  };

  const handleSaveFloor = () => {
    if (!editingFloor) return;
    
    setLocalFloors(localFloors.map(f => 
      f.id === editingFloor.id ? editingFloor : f
    ));
    toast.success('Floor updated');
    setEditingFloor(null);
    setActiveTab('overview');
  };

  const handleSaveAll = () => {
    onUpdateFloors(localFloors);
    toast.success('Floor configuration saved');
    onClose();
  };

  const handleAddZone = () => {
    if (!editingFloor) return;
    
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: 'New Zone',
      color: '#3b82f6',
      capacity: 10,
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
      zones: editingFloor.zones.map(z => 
        z.id === zoneId ? { ...z, ...updates } : z
      ),
    });
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!editingFloor) return;
    
    if (editingFloor.zones.length === 1) {
      toast.error('Floor must have at least one zone');
      return;
    }
    
    setEditingFloor({
      ...editingFloor,
      zones: editingFloor.zones.filter(z => z.id !== zoneId),
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              <Layers className="h-4 w-4 mr-2" />
              Floor Overview
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingFloor}>
              <Edit2 className="h-4 w-4 mr-2" />
              {editingFloor ? `Edit ${editingFloor.name}` : 'Edit Floor'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-hidden mt-4">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <Button onClick={handleAddFloor} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Floor
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {localFloors
                    .sort((a, b) => a.number - b.number)
                    .map(floor => (
                      <Card key={floor.id} className={!floor.enabled ? 'opacity-50' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{floor.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Floor {floor.number} • {floor.zones.length} zones
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
                                disabled={localFloors.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {floor.zones.map(zone => (
                              <Badge 
                                key={zone.id} 
                                variant="secondary"
                                style={{ backgroundColor: zone.color + '20', color: zone.color }}
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
          <TabsContent value="edit" className="flex-1 overflow-hidden mt-4">
            {editingFloor && (
              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1">
                  <div className="space-y-6 pr-4">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Basic Information</CardTitle>
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
                          <CardTitle className="text-sm">Zones</CardTitle>
                          <Button size="sm" onClick={handleAddZone}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Zone
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {editingFloor.zones.map((zone) => (
                            <Card key={zone.id}>
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Zone Configuration</Label>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteZone(zone.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                      <Label className="text-xs">Name</Label>
                                      <Input
                                        value={zone.name}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, { name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Color</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="color"
                                          value={zone.color}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, { color: e.target.value })
                                          }
                                          className="w-12 h-9 p-1"
                                        />
                                        <Input
                                          value={zone.color}
                                          onChange={(e) =>
                                            handleUpdateZone(zone.id, { color: e.target.value })
                                          }
                                          className="flex-1"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Capacity</Label>
                                      <Input
                                        type="number"
                                        value={zone.capacity}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            capacity: parseInt(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  {/* Zone Bounds */}
                                  <div className="grid grid-cols-4 gap-2">
                                    <div className="space-y-2">
                                      <Label className="text-xs">X</Label>
                                      <Input
                                        type="number"
                                        value={zone.bounds?.x || 0}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            bounds: { ...zone.bounds, x: parseInt(e.target.value), y: zone.bounds?.y || 0, width: zone.bounds?.width || 100, height: zone.bounds?.height || 100 }
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Y</Label>
                                      <Input
                                        type="number"
                                        value={zone.bounds?.y || 0}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            bounds: { ...zone.bounds, x: zone.bounds?.x || 0, y: parseInt(e.target.value), width: zone.bounds?.width || 100, height: zone.bounds?.height || 100 }
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Width</Label>
                                      <Input
                                        type="number"
                                        value={zone.bounds?.width || 100}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            bounds: { ...zone.bounds, x: zone.bounds?.x || 0, y: zone.bounds?.y || 0, width: parseInt(e.target.value), height: zone.bounds?.height || 100 }
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">Height</Label>
                                      <Input
                                        type="number"
                                        value={zone.bounds?.height || 100}
                                        onChange={(e) =>
                                          handleUpdateZone(zone.id, {
                                            bounds: { ...zone.bounds, x: zone.bounds?.x || 0, y: zone.bounds?.y || 0, width: zone.bounds?.width || 100, height: parseInt(e.target.value) }
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingFloor(null);
                      setActiveTab('overview');
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
                </div>
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