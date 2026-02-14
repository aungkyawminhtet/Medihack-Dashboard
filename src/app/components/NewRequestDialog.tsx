import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  TransportRequest,
  RequestPriority,
  EquipmentType,
} from "../types/transport";
import {
  Bed,
  Accessibility,
  AlertCircle,
  User,
  MapPin,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface NewRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onAddRequest: (request: Partial<TransportRequest>) => void;
}

export function NewRequestDialog({
  open,
  onClose,
  onAddRequest,
}: NewRequestDialogProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    patientAge: "",
    roomNumber: "",
    originFloor: "1",
    originZone: "Emergency",
    originRoom: "",
    destinationFloor: "2",
    destinationZone: "Surgery",
    destinationRoom: "",
    equipmentType: "stretcher" as EquipmentType,
    priority: "routine" as RequestPriority,
    requestedBy: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: Partial<TransportRequest> = {
      priority: formData.priority,
      status: "pending",
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
      requestedBy: formData.requestedBy || "System User",
      requestedAt: new Date(),
      notes: formData.notes || undefined,
    };

    onAddRequest(newRequest);

    // Reset form
    setFormData({
      patientName: "",
      patientId: "",
      patientAge: "",
      roomNumber: "",
      originFloor: "1",
      originZone: "Emergency",
      originRoom: "",
      destinationFloor: "2",
      destinationZone: "Surgery",
      destinationRoom: "",
      equipmentType: "stretcher",
      priority: "routine",
      requestedBy: "",
      notes: "",
    });
  };

  const zones = [
    "Emergency",
    "Surgery",
    "ICU",
    "Radiology",
    "Outpatient",
    "Cardiology",
    "General",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-dialog-slide">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Create New Transport Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-5 pb-4">
            {/* Patient Information */}
            <div className="space-y-3 animate-fade-slide">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-gray-900">
                  Patient Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName" className="text-xs font-medium">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    required
                    placeholder="John Doe"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="patientId" className="text-xs font-medium">
                    Patient ID
                  </Label>
                  <Input
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) =>
                      setFormData({ ...formData, patientId: e.target.value })
                    }
                    placeholder="PAT-1234"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="patientAge" className="text-xs font-medium">
                    Age
                  </Label>
                  <Input
                    id="patientAge"
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) =>
                      setFormData({ ...formData, patientAge: e.target.value })
                    }
                    placeholder="45"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="roomNumber" className="text-xs font-medium">
                    Current Room *
                  </Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                    required
                    placeholder="201-A"
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Origin */}
            <div
              className="space-y-3 animate-fade-slide"
              style={{ animationDelay: "50ms" }}
            >
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-gray-900">
                  Pickup Location
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="originFloor" className="text-xs font-medium">
                    Floor *
                  </Label>
                  <Select
                    value={formData.originFloor}
                    onValueChange={(value) =>
                      setFormData({ ...formData, originFloor: value })
                    }
                  >
                    <SelectTrigger id="originFloor" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="originZone" className="text-xs font-medium">
                    Zone *
                  </Label>
                  <Select
                    value={formData.originZone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, originZone: value })
                    }
                  >
                    <SelectTrigger id="originZone" className="h-9">
                      <SelectValue />
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
                <div className="space-y-1.5">
                  <Label htmlFor="originRoom" className="text-xs font-medium">
                    Room *
                  </Label>
                  <Input
                    id="originRoom"
                    value={formData.originRoom}
                    onChange={(e) =>
                      setFormData({ ...formData, originRoom: e.target.value })
                    }
                    required
                    placeholder="ER-5"
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Destination */}
            <div
              className="space-y-3 animate-fade-slide"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 pb-2 border-b">
                <ArrowRight className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-sm text-gray-900">
                  Destination
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="destinationFloor"
                    className="text-xs font-medium"
                  >
                    Floor *
                  </Label>
                  <Select
                    value={formData.destinationFloor}
                    onValueChange={(value) =>
                      setFormData({ ...formData, destinationFloor: value })
                    }
                  >
                    <SelectTrigger id="destinationFloor" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="destinationZone"
                    className="text-xs font-medium"
                  >
                    Zone *
                  </Label>
                  <Select
                    value={formData.destinationZone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, destinationZone: value })
                    }
                  >
                    <SelectTrigger id="destinationZone" className="h-9">
                      <SelectValue />
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
                <div className="space-y-1.5">
                  <Label
                    htmlFor="destinationRoom"
                    className="text-xs font-medium"
                  >
                    Room *
                  </Label>
                  <Input
                    id="destinationRoom"
                    value={formData.destinationRoom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinationRoom: e.target.value,
                      })
                    }
                    required
                    placeholder="OR-2"
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Transport Details */}
            <div
              className="space-y-3 animate-fade-slide"
              style={{ animationDelay: "150ms" }}
            >
              <div className="flex items-center gap-2 pb-2 border-b">
                <Bed className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold text-sm text-gray-900">
                  Transport Details
                </h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Equipment Type *
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        formData.equipmentType === "stretcher"
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 h-9"
                      onClick={() =>
                        setFormData({ ...formData, equipmentType: "stretcher" })
                      }
                    >
                      <Bed className="h-4 w-4 mr-2" />
                      Stretcher
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.equipmentType === "wheelchair"
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 h-9"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          equipmentType: "wheelchair",
                        })
                      }
                    >
                      <Accessibility className="h-4 w-4 mr-2" />
                      Wheelchair
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority" className="text-xs font-medium">
                    Priority *
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        priority: value as RequestPriority,
                      })
                    }
                  >
                    <SelectTrigger id="priority" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          Routine
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          Urgent
                        </div>
                      </SelectItem>
                      <SelectItem value="emergency">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Emergency
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div
              className="space-y-3 animate-fade-slide"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2 pb-2 border-b">
                <FileText className="h-4 w-4 text-gray-600" />
                <h3 className="font-semibold text-sm text-gray-900">
                  Additional Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="requestedBy" className="text-xs font-medium">
                    Requested By
                  </Label>
                  <Input
                    id="requestedBy"
                    value={formData.requestedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, requestedBy: e.target.value })
                    }
                    placeholder="Dr. Smith"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs font-medium">
                    Special Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any special instructions or patient conditions..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Alert for Emergency */}
            {formData.priority === "emergency" && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-slide">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-xs text-red-800">
                  <strong>Emergency Request:</strong> This will be prioritized
                  at the top of the queue and assigned immediately to the
                  nearest available staff.
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>

        <style>{`
          @keyframes fade-slide {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dialog-slide {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-fade-slide {
            animation: fade-slide 300ms ease-out;
          }

          .animate-dialog-slide {
            animation: dialog-slide 250ms ease-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
