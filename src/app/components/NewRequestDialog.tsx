import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { TransportRequest, RequestPriority, EquipmentType } from '../types/transport';
import { Bed, Accessibility, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface NewRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onAddRequest: (request: Partial<TransportRequest>) => void;
}

export function NewRequestDialog({ open, onClose, onAddRequest }: NewRequestDialogProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    patientAge: '',
    roomNumber: '',
    originFloor: '1',
    originZone: 'Emergency',
    originRoom: '',
    destinationFloor: '2',
    destinationZone: 'Surgery',
    destinationRoom: '',
    equipmentType: 'stretcher' as EquipmentType,
    priority: 'routine' as RequestPriority,
    requestedBy: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: Partial<TransportRequest> = {
      priority: formData.priority,
      status: 'pending',
      patientInfo: {
        id: formData.patientId || `PAT-${Date.now()}`,
        name: formData.patientName,
        age: formData.patientAge ? parseInt(formData.patientAge) : undefined,
        roomNumber: formData.roomNumber,
      },
      origin: {
        floor: parseInt(formData.originFloor),
        zone: formData.originZone,
        room: formData.originRoom,
      },
      destination: {
        floor: parseInt(formData.destinationFloor),
        zone: formData.destinationZone,
        room: formData.destinationRoom,
      },
      equipmentType: formData.equipmentType,
      requestedBy: formData.requestedBy || 'System User',
      requestedAt: new Date(),
      notes: formData.notes || undefined,
    };

    onAddRequest(newRequest);
    
    // Reset form
    setFormData({
      patientName: '',
      patientId: '',
      patientAge: '',
      roomNumber: '',
      originFloor: '1',
      originZone: 'Emergency',
      originRoom: '',
      destinationFloor: '2',
      destinationZone: 'Surgery',
      destinationRoom: '',
      equipmentType: 'stretcher',
      priority: 'routine',
      requestedBy: '',
      notes: '',
    });
  };

  const zones = ['Emergency', 'Surgery', 'ICU', 'Radiology', 'Outpatient', 'Cardiology', 'General'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Transport Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="PAT-1234"
                />
              </div>
              <div>
                <Label htmlFor="patientAge">Age</Label>
                <Input
                  id="patientAge"
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  placeholder="45"
                />
              </div>
              <div>
                <Label htmlFor="roomNumber">Current Room *</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                  placeholder="201-A"
                />
              </div>
            </div>
          </div>

          {/* Origin */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Pickup Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="originFloor">Floor *</Label>
                <Select
                  value={formData.originFloor}
                  onValueChange={(value) => setFormData({ ...formData, originFloor: value })}
                >
                  <SelectTrigger id="originFloor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="originZone">Zone *</Label>
                <Select
                  value={formData.originZone}
                  onValueChange={(value) => setFormData({ ...formData, originZone: value })}
                >
                  <SelectTrigger id="originZone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="originRoom">Room *</Label>
                <Input
                  id="originRoom"
                  value={formData.originRoom}
                  onChange={(e) => setFormData({ ...formData, originRoom: e.target.value })}
                  required
                  placeholder="ER-5"
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Destination</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="destinationFloor">Floor *</Label>
                <Select
                  value={formData.destinationFloor}
                  onValueChange={(value) => setFormData({ ...formData, destinationFloor: value })}
                >
                  <SelectTrigger id="destinationFloor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destinationZone">Zone *</Label>
                <Select
                  value={formData.destinationZone}
                  onValueChange={(value) => setFormData({ ...formData, destinationZone: value })}
                >
                  <SelectTrigger id="destinationZone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destinationRoom">Room *</Label>
                <Input
                  id="destinationRoom"
                  value={formData.destinationRoom}
                  onChange={(e) => setFormData({ ...formData, destinationRoom: e.target.value })}
                  required
                  placeholder="OR-2"
                />
              </div>
            </div>
          </div>

          {/* Transport Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Transport Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Equipment Type *</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={formData.equipmentType === 'stretcher' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, equipmentType: 'stretcher' })}
                  >
                    <Bed className="h-4 w-4 mr-2" />
                    Stretcher
                  </Button>
                  <Button
                    type="button"
                    variant={formData.equipmentType === 'wheelchair' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, equipmentType: 'wheelchair' })}
                  >
                    <Accessibility className="h-4 w-4 mr-2" />
                    Wheelchair
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as RequestPriority })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">
                      <Badge className="bg-blue-500">Routine</Badge>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <Badge className="bg-orange-500">Urgent</Badge>
                    </SelectItem>
                    <SelectItem value="emergency">
                      <Badge className="bg-red-500">Emergency</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                placeholder="Dr. Smith"
              />
            </div>
            <div>
              <Label htmlFor="notes">Special Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or patient conditions..."
                rows={3}
              />
            </div>
          </div>

          {/* Alert for Emergency */}
          {formData.priority === 'emergency' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-800">
                <strong>Emergency Request:</strong> This will be prioritized at the top of the queue 
                and assigned immediately to the nearest available staff.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}