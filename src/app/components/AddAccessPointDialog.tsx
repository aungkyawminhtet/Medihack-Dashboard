import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { AccessPoint, AP_MODELS } from "../types/access-point";
import { FloorConfig } from "../types/floor-config";
import { Wifi, Radio, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AddAccessPointDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAccessPoint: (ap: Omit<AccessPoint, "id">) => void;
  floorConfigs: FloorConfig[];
}

export function AddAccessPointDialog({
  open,
  onClose,
  onAddAccessPoint,
  floorConfigs,
}: AddAccessPointDialogProps) {
  const enabledFloors = floorConfigs
    .filter((f) => f.enabled)
    .sort((a, b) => a.number - b.number);

  const [formData, setFormData] = useState({
    name: "",
    model: "AP-535" as "AP-535" | "AP-503H",
    floor: enabledFloors.length > 0 ? enabledFloors[0].number : 0,
    zone: "",
    ipAddress: "",
    macAddress: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get zones for selected floor
  const selectedFloor = enabledFloors.find((f) => f.number === formData.floor);
  const availableZones = selectedFloor?.zones || [];

  // Update zone when floor changes
  useEffect(() => {
    if (
      availableZones.length > 0 &&
      !availableZones.find((z) => z.name === formData.zone)
    ) {
      setFormData((prev) => ({ ...prev, zone: availableZones[0].name }));
    }
  }, [formData.floor, availableZones]);

  // Initialize zone on dialog open
  useEffect(() => {
    if (open && formData.zone === "" && availableZones.length > 0) {
      setFormData((prev) => ({ ...prev, zone: availableZones[0].name }));
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Access Point name is required";
    }
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "IP Address is required";
    }
    if (!formData.macAddress.trim()) {
      newErrors.macAddress = "MAC Address is required";
    }
    if (enabledFloors.length === 0) {
      newErrors.floor = "No floors available";
    }
    if (availableZones.length === 0) {
      newErrors.zone = "No zones available for selected floor";
    }
    if (!formData.zone) {
      newErrors.zone = "Zone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newAP: Omit<AccessPoint, "id"> = {
      name: formData.name.trim(),
      model: formData.model,
      location: {
        floor: formData.floor,
        zone: formData.zone,
        x: Math.random() * 800 + 100,
        y: Math.random() * 500 + 100,
      },
      status: "online",
      bleRange: AP_MODELS[formData.model].bleRange,
      clients: 0,
      signalStrength: 100,
      ipAddress: formData.ipAddress.trim(),
      macAddress: formData.macAddress.trim(),
      firmwareVersion: "8.10.0.0",
      lastSeen: new Date().toISOString(),
    };

    onAddAccessPoint(newAP);
    toast.success("Access Point added successfully");

    // Reset form
    setFormData({
      name: "",
      model: "AP-535",
      floor: enabledFloors.length > 0 ? enabledFloors[0].number : 0,
      zone:
        enabledFloors.length > 0 && enabledFloors[0].zones.length > 0
          ? enabledFloors[0].zones[0].name
          : "",
      ipAddress: "",
      macAddress: "",
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      model: "AP-535",
      floor: enabledFloors.length > 0 ? enabledFloors[0].number : 0,
      zone:
        enabledFloors.length > 0 && enabledFloors[0].zones.length > 0
          ? enabledFloors[0].zones[0].name
          : "",
      ipAddress: "",
      macAddress: "",
    });
    setErrors({});
    onClose();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Add New Access Point
          </DialogTitle>
          <DialogDescription>
            Add a new Aruba access point for BLE and IoT connectivity
          </DialogDescription>
        </DialogHeader>

        {enabledFloors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="font-medium">No floors available</p>
            <p className="text-sm text-muted-foreground">
              Please create at least one floor in Floor Management first
            </p>
            <Button onClick={handleClose} variant="outline" className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* AP Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-500" : ""}
                >
                  Access Point Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Dept AP"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* AP Model */}
              <div className="space-y-2">
                <Label>AP Model</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={
                      formData.model === "AP-535" ? "default" : "outline"
                    }
                    className="flex-col h-auto py-3"
                    onClick={() =>
                      setFormData({ ...formData, model: "AP-535" })
                    }
                  >
                    <Radio className="h-5 w-5 mb-1" />
                    <span className="font-semibold">AP-535</span>
                    <span className="text-xs opacity-80">~50m BLE Range</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      formData.model === "AP-503H" ? "default" : "outline"
                    }
                    className="flex-col h-auto py-3"
                    onClick={() =>
                      setFormData({ ...formData, model: "AP-503H" })
                    }
                  >
                    <Wifi className="h-5 w-5 mb-1" />
                    <span className="font-semibold">AP-503H</span>
                    <span className="text-xs opacity-80">~40m BLE Range</span>
                  </Button>
                </div>
              </div>

              {/* Floor */}
              <div className="space-y-2">
                <Label
                  htmlFor="floor"
                  className={errors.floor ? "text-red-500" : ""}
                >
                  Floor *
                </Label>
                <Select
                  value={formData.floor.toString()}
                  onValueChange={(value) => {
                    const newFloor = parseInt(value);
                    const newFloorConfig = enabledFloors.find(
                      (f) => f.number === newFloor,
                    );
                    const newZone =
                      newFloorConfig && newFloorConfig.zones.length > 0
                        ? newFloorConfig.zones[0].name
                        : "";
                    setFormData({
                      ...formData,
                      floor: newFloor,
                      zone: newZone,
                    });
                    if (errors.floor) setErrors({ ...errors, floor: "" });
                  }}
                >
                  <SelectTrigger
                    id="floor"
                    className={errors.floor ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledFloors.map((floor) => (
                      <SelectItem
                        key={floor.number}
                        value={floor.number.toString()}
                      >
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.floor && (
                  <p className="text-xs text-red-500">{errors.floor}</p>
                )}
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <Label
                  htmlFor="zone"
                  className={errors.zone ? "text-red-500" : ""}
                >
                  Zone *
                </Label>
                <Select
                  value={formData.zone || ""}
                  onValueChange={(value) => {
                    setFormData({ ...formData, zone: value });
                    if (errors.zone) setErrors({ ...errors, zone: "" });
                  }}
                >
                  <SelectTrigger
                    id="zone"
                    className={errors.zone ? "border-red-500" : ""}
                  >
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
                {errors.zone && (
                  <p className="text-xs text-red-500">{errors.zone}</p>
                )}
              </div>

              {/* IP Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="ipAddress"
                  className={errors.ipAddress ? "text-red-500" : ""}
                >
                  IP Address *
                </Label>
                <Input
                  id="ipAddress"
                  placeholder="e.g., 10.10.1.101"
                  value={formData.ipAddress}
                  onChange={(e) => {
                    setFormData({ ...formData, ipAddress: e.target.value });
                    if (errors.ipAddress)
                      setErrors({ ...errors, ipAddress: "" });
                  }}
                  className={errors.ipAddress ? "border-red-500" : ""}
                />
                {errors.ipAddress && (
                  <p className="text-xs text-red-500">{errors.ipAddress}</p>
                )}
              </div>

              {/* MAC Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="macAddress"
                  className={errors.macAddress ? "text-red-500" : ""}
                >
                  MAC Address *
                </Label>
                <Input
                  id="macAddress"
                  placeholder="e.g., 00:1A:1E:01:23:45"
                  value={formData.macAddress}
                  onChange={(e) => {
                    setFormData({ ...formData, macAddress: e.target.value });
                    if (errors.macAddress)
                      setErrors({ ...errors, macAddress: "" });
                  }}
                  className={errors.macAddress ? "border-red-500" : ""}
                />
                {errors.macAddress && (
                  <p className="text-xs text-red-500">{errors.macAddress}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={hasErrors && Object.keys(errors).length > 0}
              >
                Add Access Point
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
