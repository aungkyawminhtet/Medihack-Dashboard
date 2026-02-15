import React, { useMemo, useState, useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { AddEquipmentDialog } from "../components/AddEquipmentDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Edit2, Plus, Trash2, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TransportEquipment } from "../types/transport";

type EquipmentFilter =
  | "all"
  | "available"
  | "in-use"
  | "requested"
  | "maintenance"
  | "stretcher"
  | "wheelchair";

export default function EquipmentPage() {
  const {
    equipment,
    floorConfig,
    handleAddEquipment,
    handleUpdateEquipment,
    handleDeleteEquipment,
    handleAssignEquipmentLocation,
  } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<
    string | undefined
  >();
  const [filterMode, setFilterMode] = useState<EquipmentFilter>("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TransportEquipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransportEquipment | null>(
    null,
  );
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<TransportEquipment | null>(
    null,
  );
  const [assignForm, setAssignForm] = useState({
    floor: 1,
    zone: "Emergency",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    model: "",
    type: "stretcher" as TransportEquipment["type"],
    status: "available" as TransportEquipment["status"],
    floor: 1,
    zone: "Emergency",
    batteryLevel: 100,
    maintenanceNote: "",
  });

  const availableCount = equipment.filter(
    (eq) => eq.status === "available",
  ).length;
  const inUseCount = equipment.filter((eq) => eq.status === "in-use").length;
  const requestedCount = equipment.filter(
    (eq) => eq.status === "requested",
  ).length;
  const maintenanceCount = equipment.filter(
    (eq) => eq.status === "maintenance",
  ).length;

  const stretcherCount = equipment.filter(
    (eq) => eq.type === "stretcher",
  ).length;
  const wheelchairCount = equipment.filter(
    (eq) => eq.type === "wheelchair",
  ).length;

  const filteredEquipment = useMemo(() => {
    switch (filterMode) {
      case "available":
      case "in-use":
      case "requested":
      case "maintenance":
        return equipment.filter((eq) => eq.status === filterMode);
      case "stretcher":
      case "wheelchair":
        return equipment.filter((eq) => eq.type === filterMode);
      case "all":
      default:
        return equipment;
    }
  }, [equipment, filterMode]);

  const filterLabel = useMemo(() => {
    switch (filterMode) {
      case "available":
        return "Available Equipment";
      case "in-use":
        return "In Use Equipment";
      case "requested":
        return "Requested Equipment";
      case "maintenance":
        return "Maintenance Equipment";
      case "stretcher":
        return "Stretchers";
      case "wheelchair":
        return "Wheelchairs";
      case "all":
      default:
        return "All Equipment";
    }
  }, [filterMode]);

  const enabledFloors = useMemo(
    () => floorConfig.filter((floor) => floor.enabled),
    [floorConfig],
  );

  const zonesByFloor = useMemo(() => {
    const map = new Map<number, string[]>();
    enabledFloors.forEach((floor) => {
      map.set(
        floor.number,
        floor.zones.map((zone) => zone.name),
      );
    });
    return map;
  }, [enabledFloors]);

  const editZones = useMemo(
    () => zonesByFloor.get(editForm.floor) ?? [],
    [zonesByFloor, editForm.floor],
  );

  const assignZones = useMemo(
    () => zonesByFloor.get(assignForm.floor) ?? [],
    [zonesByFloor, assignForm.floor],
  );

  useEffect(() => {
    if (!editZones.length) return;
    if (!editZones.includes(editForm.zone)) {
      setEditForm((prev) => ({ ...prev, zone: editZones[0] }));
    }
  }, [editZones, editForm.zone]);

  useEffect(() => {
    if (!assignZones.length) return;
    if (!assignZones.includes(assignForm.zone)) {
      setAssignForm((prev) => ({ ...prev, zone: assignZones[0] }));
    }
  }, [assignZones, assignForm.zone]);

  const openEditDialog = (eq: TransportEquipment) => {
    setEditTarget(eq);
    setEditForm({
      name: eq.name || "",
      model: eq.model || "",
      type: eq.type,
      status: eq.status,
      floor: eq.location.floor,
      zone: eq.location.zone,
      batteryLevel: eq.batteryLevel ?? 0,
      maintenanceNote: eq.maintenanceNote || "",
    });
    setEditOpen(true);
  };

  const openAssignDialog = (eq: TransportEquipment) => {
    setAssignTarget(eq);
    setAssignForm({
      floor: eq.location.floor,
      zone: eq.location.zone,
    });
    setAssignOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTarget) return;

    handleUpdateEquipment(editTarget.id, {
      name: editForm.name.trim() || editTarget.name,
      model: editForm.model.trim() || undefined,
      type: editForm.type,
      status: editForm.status,
      batteryLevel: editForm.batteryLevel,
      maintenanceNote:
        editForm.status === "maintenance"
          ? editForm.maintenanceNote.trim() || undefined
          : undefined,
      location: {
        x: editTarget.location.x,
        y: editTarget.location.y,
        floor: editForm.floor,
        zone: editForm.zone,
      },
    });

    setEditOpen(false);
    setEditTarget(null);
  };

  const handleAssignSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignTarget) return;

    handleAssignEquipmentLocation(
      assignTarget.id,
      assignForm.floor,
      assignForm.zone,
    );

    setAssignOpen(false);
    setAssignTarget(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6 animate-fadeInUpSlow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Equipment Management
            </h2>
            <p className="text-muted-foreground">
              Track and manage stretchers and wheelchairs
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4 xl:grid-cols-7">
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-gray-50"
            onClick={() => setFilterMode("all")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{equipment.length}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-green-50"
            onClick={() => setFilterMode("available")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {availableCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-blue-50"
            onClick={() => setFilterMode("in-use")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {inUseCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-orange-50"
            onClick={() => setFilterMode("requested")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {requestedCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-red-50"
            onClick={() => setFilterMode("maintenance")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {maintenanceCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-purple-50"
            onClick={() => setFilterMode("stretcher")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stretchers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stretcherCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-cyan-50"
            onClick={() => setFilterMode("wheelchair")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wheelchairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">
                {wheelchairCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment List */}
        <div className="flex-1 bg-white rounded-lg border p-4 overflow-hidden">
          <div className="h-full min-h-0 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{filterLabel}</h3>
                <Badge variant="secondary">
                  {filteredEquipment.length} items
                </Badge>
              </div>
              {filterMode !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterMode("all")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1 min-h-0 rounded-md border bg-white">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-blue-50">
                    <TableRow>
                      <TableHead className="py-3">ID</TableHead>
                      <TableHead className="py-3">Type</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                      <TableHead className="py-3">Floor</TableHead>
                      <TableHead className="py-3">Zone</TableHead>
                      <TableHead className="py-3">Battery</TableHead>
                      <TableHead className="py-3">Last Used</TableHead>
                      {(filterMode === "all" || filterMode === "available") && (
                        <TableHead className="py-3 text-right">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((eq) => (
                      <TableRow
                        key={eq.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedEquipmentId(eq.id)}
                      >
                        <TableCell className="py-3 font-medium">
                          {eq.id}
                        </TableCell>
                        <TableCell className="py-3 capitalize">
                          {eq.type}
                        </TableCell>
                        <TableCell className="py-3 capitalize">
                          {eq.status}
                        </TableCell>
                        <TableCell className="py-3">
                          {eq.location.floor}
                        </TableCell>
                        <TableCell className="py-3">
                          {eq.location.zone}
                        </TableCell>
                        <TableCell className="py-3">
                          {eq.batteryLevel !== undefined
                            ? `${eq.batteryLevel}%`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="py-3">
                          {eq.lastUsed
                            ? new Date(eq.lastUsed).toLocaleString()
                            : "N/A"}
                        </TableCell>
                        {filterMode === "all" && (
                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openEditDialog(eq);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-700"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setDeleteTarget(eq);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                        {filterMode === "available" && (
                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-green-50 hover:text-green-700"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openAssignDialog(eq);
                                }}
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <AddEquipmentDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddEquipment={(data) => {
          handleAddEquipment(data);
          setShowAddDialog(false);
        }}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Update details for {editTarget?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="equipment-name">Name</Label>
                <Input
                  id="equipment-name"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({ ...editForm, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="equipment-model">Model</Label>
                <Input
                  id="equipment-model"
                  value={editForm.model}
                  onChange={(event) =>
                    setEditForm({ ...editForm, model: event.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value: TransportEquipment["type"]) =>
                      setEditForm({ ...editForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stretcher">Stretcher</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: TransportEquipment["status"]) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Floor</Label>
                  <Select
                    value={editForm.floor.toString()}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, floor: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {enabledFloors.map((floor) => (
                        <SelectItem
                          key={floor.id}
                          value={floor.number.toString()}
                        >
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Zone</Label>
                  <Select
                    value={editForm.zone}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, zone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {editZones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="equipment-battery">Battery Level (%)</Label>
                <Input
                  id="equipment-battery"
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.batteryLevel}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      batteryLevel: Number(event.target.value),
                    })
                  }
                />
              </div>
              {editForm.status === "maintenance" && (
                <div className="grid gap-2">
                  <Label htmlFor="equipment-maintenance">
                    Maintenance Note
                  </Label>
                  <Input
                    id="equipment-maintenance"
                    value={editForm.maintenanceNote}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        maintenanceNote: event.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete equipment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove
              {deleteTarget ? ` ${deleteTarget.id}` : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteTarget) return;
                handleDeleteEquipment(deleteTarget.id);
                if (selectedEquipmentId === deleteTarget.id) {
                  setSelectedEquipmentId(undefined);
                }
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Assign Equipment Location</DialogTitle>
            <DialogDescription>
              Set floor and zone for {assignTarget?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Floor</Label>
                <Select
                  value={assignForm.floor.toString()}
                  onValueChange={(value) =>
                    setAssignForm({ ...assignForm, floor: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledFloors.map((floor) => (
                      <SelectItem
                        key={floor.id}
                        value={floor.number.toString()}
                      >
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Zone</Label>
                <Select
                  value={assignForm.zone}
                  onValueChange={(value) =>
                    setAssignForm({ ...assignForm, zone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssignOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign Location</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
