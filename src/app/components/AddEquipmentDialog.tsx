import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TransportEquipment, EquipmentType, EquipmentStatus } from '../types/transport';
import { Bed, Accessibility } from 'lucide-react';

interface AddEquipmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAddEquipment: (equipment: Omit<TransportEquipment, 'id'>) => void;
}

export function AddEquipmentDialog({ open, onClose, onAddEquipment }: AddEquipmentDialogProps) {
  const [formData, setFormData] = useState({
    type: 'stretcher' as EquipmentType,
    status: 'available' as EquipmentStatus,
    floor: 1,
    zone: 'Emergency',
    batteryLevel: 100,
    maintenanceNote: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEquipment: Omit<TransportEquipment, 'id'> = {
      type: formData.type,
      status: formData.status,
      location: {
        floor: formData.floor,
        zone: formData.zone,
        x: Math.random() * 800 + 100,
        y: Math.random() * 500 + 100,
      },
      batteryLevel: formData.batteryLevel,
      assignedStaff: null,
      currentRequest: null,
      lastUsed: new Date().toISOString(),
      maintenanceNote: formData.maintenanceNote || undefined,
    };

    onAddEquipment(newEquipment);
    
    // Reset form
    setFormData({
      type: 'stretcher',
      status: 'available',
      floor: 1,
      zone: 'Emergency',
      batteryLevel: 100,
      maintenanceNote: '',
    });
  };

  const zones = [
    'Emergency',
    'ICU',
    'Surgery',
    'Radiology',
    'General Ward',
    'Pediatrics',
    'Maternity',
    'Outpatient',
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>
            Add a new stretcher or wheelchair to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Equipment Type */}
            <div className="space-y-2">
              <Label>Equipment Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.type === 'stretcher' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, type: 'stretcher' })}
                >
                  <Bed className="h-4 w-4 mr-2" />
                  Stretcher
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'wheelchair' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData({ ...formData, type: 'wheelchair' })}
                >
                  <Accessibility className="h-4 w-4 mr-2" />
                  Wheelchair
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: EquipmentStatus) => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={formData.floor.toString()}
                onValueChange={(value) => 
                  setFormData({ ...formData, floor: parseInt(value) })
                }
              >
                <SelectTrigger id="floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Floor 1</SelectItem>
                  <SelectItem value="2">Floor 2</SelectItem>
                  <SelectItem value="3">Floor 3</SelectItem>
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
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Battery Level */}
            <div className="space-y-2">
              <Label htmlFor="battery">Battery Level (%)</Label>
              <Input
                id="battery"
                type="number"
                min="0"
                max="100"
                value={formData.batteryLevel}
                onChange={(e) =>
                  setFormData({ ...formData, batteryLevel: parseInt(e.target.value) })
                }
              />
            </div>

            {/* Maintenance Note (conditional) */}
            {formData.status === 'maintenance' && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceNote">Maintenance Note</Label>
                <Input
                  id="maintenanceNote"
                  placeholder="Describe the maintenance issue..."
                  value={formData.maintenanceNote}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenanceNote: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Equipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
