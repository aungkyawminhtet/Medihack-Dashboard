import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AccessPoint, AP_MODELS } from '../types/access-point';
import { FloorConfig } from '../types/floor-config';
import { Wifi, Radio } from 'lucide-react';

interface AddAccessPointDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAccessPoint: (ap: Omit<AccessPoint, 'id'>) => void;
  floorConfigs: FloorConfig[];
}

export function AddAccessPointDialog({ open, onClose, onAddAccessPoint, floorConfigs }: AddAccessPointDialogProps) {
  const enabledFloors = floorConfigs.filter(f => f.enabled);
  const defaultFloor = enabledFloors && enabledFloors.length > 0 ? enabledFloors[0].number : 1;
  const selectedFloorConfig = enabledFloors.find(f => f.number === defaultFloor);
  const defaultZone = selectedFloorConfig && selectedFloorConfig.zones.length > 0 
    ? selectedFloorConfig.zones[0].name 
    : 'Emergency';
  
  const [formData, setFormData] = useState({
    name: '',
    model: 'AP-535' as 'AP-535' | 'AP-503H',
    floor: defaultFloor,
    zone: defaultZone,
    ipAddress: '',
    macAddress: '',
  });

  // Get zones for selected floor
  const selectedFloor = enabledFloors.find(f => f.number === formData.floor);
  const availableZones = selectedFloor?.zones || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAP: Omit<AccessPoint, 'id'> = {
      name: formData.name,
      model: formData.model,
      location: {
        floor: formData.floor,
        zone: formData.zone,
        x: Math.random() * 800 + 100,
        y: Math.random() * 500 + 100,
      },
      status: 'online',
      bleRange: AP_MODELS[formData.model].bleRange,
      clients: 0,
      signalStrength: 100,
      ipAddress: formData.ipAddress,
      macAddress: formData.macAddress,
      firmwareVersion: '8.10.0.0',
      lastSeen: new Date().toISOString(),
    };

    onAddAccessPoint(newAP);
    
    // Reset form
    setFormData({
      name: '',
      model: 'AP-535',
      floor: defaultFloor,
      zone: defaultZone,
      ipAddress: '',
      macAddress: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Access Point</DialogTitle>
          <DialogDescription>
            Add a new Aruba access point for BLE and IoT connectivity
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* AP Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Access Point Name</Label>
              <Input
                id="name"
                placeholder="e.g., Emergency Dept AP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* AP Model */}
            <div className="space-y-2">
              <Label>AP Model</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.model === 'AP-535' ? 'default' : 'outline'}
                  className="flex-col h-auto py-3"
                  onClick={() => setFormData({ ...formData, model: 'AP-535' })}
                >
                  <Radio className="h-5 w-5 mb-1" />
                  <span className="font-semibold">AP-535</span>
                  <span className="text-xs opacity-80">~50m BLE Range</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.model === 'AP-503H' ? 'default' : 'outline'}
                  className="flex-col h-auto py-3"
                  onClick={() => setFormData({ ...formData, model: 'AP-503H' })}
                >
                  <Wifi className="h-5 w-5 mb-1" />
                  <span className="font-semibold">AP-503H</span>
                  <span className="text-xs opacity-80">~40m BLE Range</span>
                </Button>
              </div>
            </div>

            {/* Floor */}
            <div className="space-y-2 bg-amber-800">
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={formData.floor.toString()}
                onValueChange={(value) => {
                  const newFloor = parseInt(value);
                  const newFloorConfig = enabledFloors.find(f => f.number === newFloor);
                  const newZone = newFloorConfig && newFloorConfig.zones.length > 0 
                    ? newFloorConfig.zones[0].name 
                    : formData.zone;
                  setFormData({ ...formData, floor: newFloor, zone: newZone });
                }}
              >
                <SelectTrigger id="floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {enabledFloors.map((floor) => (
                    <SelectItem key={floor.number} value={floor.number.toString()}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) => 
                  setFormData({ ...formData, zone: value })
                }
              >
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {availableZones.length > 0 ? (
                    availableZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: zone.color }}
                          />
                          {zone.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="default" disabled>
                      No zones available for this floor
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* IP Address */}
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                placeholder="e.g., 10.10.1.101"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                required
              />
            </div>

            {/* MAC Address */}
            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                placeholder="e.g., 00:1A:1E:01:23:45"
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Access Point</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}