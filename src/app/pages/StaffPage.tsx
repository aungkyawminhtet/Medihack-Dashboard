import React, { useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StaffMember } from "../types/transport";

type StaffFilter = "all" | "available" | "busy" | "off-duty";

export default function StaffPage() {
  const { staff, handleAddStaff, handleUpdateStaff, handleDeleteStaff } =
    useApp();
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>();
  const [filterMode, setFilterMode] = useState<StaffFilter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "Patient Transport",
    status: "available" as StaffMember["status"],
    floor: 1,
    zone: "Emergency",
    currentWorkload: 0,
    completedToday: 0,
  });

  const availableCount = staff.filter((s) => s.status === "available").length;
  const busyCount = staff.filter((s) => s.status === "busy").length;
  const offDutyCount = staff.filter((s) => s.status === "off-duty").length;
  const totalWorkload = staff.reduce((sum, s) => sum + s.currentWorkload, 0);
  const totalCompleted = staff.reduce((sum, s) => sum + s.completedToday, 0);
  const avgWorkload =
    staff.length > 0 ? (totalWorkload / staff.length).toFixed(1) : "0";

  const filteredStaff = useMemo(() => {
    if (filterMode === "all") return staff;
    return staff.filter((s) => s.status === filterMode);
  }, [staff, filterMode]);

  const filterLabel = useMemo(() => {
    switch (filterMode) {
      case "available":
        return "Available Staff";
      case "busy":
        return "Busy Staff";
      case "off-duty":
        return "Off Duty Staff";
      case "all":
      default:
        return "All Staff";
    }
  }, [filterMode]);

  const zones = [
    "Emergency",
    "ICU",
    "Surgery",
    "Radiology",
    "General Ward",
    "Pediatrics",
    "Maternity",
    "Outpatient",
  ];

  const openEditDialog = (member: StaffMember) => {
    setEditTarget(member);
    setStaffForm({
      name: member.name,
      role: member.role,
      status: member.status,
      floor: member.location.floor,
      zone: member.location.zone,
      currentWorkload: member.currentWorkload,
      completedToday: member.completedToday,
    });
    setEditOpen(true);
  };

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAddStaff({
      name: staffForm.name.trim() || "New Staff",
      role: staffForm.role.trim() || "Patient Transport",
      status: staffForm.status,
      location: {
        x: 200,
        y: 200,
        floor: staffForm.floor,
        zone: staffForm.zone,
      },
      currentWorkload: staffForm.currentWorkload,
      completedToday: staffForm.completedToday,
    });
    setAddOpen(false);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTarget) return;

    handleUpdateStaff(editTarget.id, {
      name: staffForm.name.trim() || editTarget.name,
      role: staffForm.role.trim() || editTarget.role,
      status: staffForm.status,
      location: {
        x: editTarget.location.x,
        y: editTarget.location.y,
        floor: staffForm.floor,
        zone: staffForm.zone,
      },
      currentWorkload: staffForm.currentWorkload,
      completedToday: staffForm.completedToday,
    });

    setEditOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
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

            .animate-fade-slide {
              animation: fade-slide 240ms ease-out;
            }
          `}</style>
            <h2 className="text-2xl font-semibold mb-2">Staff Management</h2>
            <p className="text-muted-foreground">
              Monitor staff workload and availability
            </p>
          </div>
          <Button
            onClick={() => {
              setStaffForm({
                name: "",
                role: "Patient Transport",
                status: "available",
                floor: 1,
                zone: "Emergency",
                currentWorkload: 0,
                completedToday: 0,
              });
              setAddOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4 xl:grid-cols-6">
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-gray-50"
            onClick={() => setFilterMode("all")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{staff.length}</div>
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
            className="cursor-pointer transition-all hover:shadow-md bg-orange-50"
            onClick={() => setFilterMode("busy")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Busy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {busyCount}
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md bg-gray-100"
            onClick={() => setFilterMode("off-duty")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Off Duty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">
                {offDutyCount}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {avgWorkload}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalCompleted}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <div className="flex-1 bg-white rounded-lg border p-4 overflow-hidden">
          <div className="h-full min-h-0 flex flex-col animate-fade-slide">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{filterLabel}</h3>
                <Badge variant="secondary">{filteredStaff.length} items</Badge>
              </div>
              {filterMode !== "all" && (
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setFilterMode("all")}
                >
                  Clear Filter
                </button>
              )}
            </div>
            <ScrollArea className="flex-1 min-h-0 rounded-md border bg-white">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-blue-50">
                    <TableRow>
                      <TableHead className="py-3">ID</TableHead>
                      <TableHead className="py-3">Name</TableHead>
                      <TableHead className="py-3">Role</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                      <TableHead className="py-3">Floor</TableHead>
                      <TableHead className="py-3">Zone</TableHead>
                      <TableHead className="py-3">Workload</TableHead>
                      <TableHead className="py-3">Completed</TableHead>
                      {filterMode === "all" && (
                        <TableHead className="py-3 text-right">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow
                        key={member.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedStaffId(member.id)}
                      >
                        <TableCell className="py-3 font-medium">
                          {member.id}
                        </TableCell>
                        <TableCell className="py-3">{member.name}</TableCell>
                        <TableCell className="py-3">{member.role}</TableCell>
                        <TableCell className="py-3 capitalize">
                          {member.status}
                        </TableCell>
                        <TableCell className="py-3">
                          {member.location.floor}
                        </TableCell>
                        <TableCell className="py-3">
                          {member.location.zone}
                        </TableCell>
                        <TableCell className="py-3">
                          {member.currentWorkload}
                        </TableCell>
                        <TableCell className="py-3">
                          {member.completedToday}
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
                                  openEditDialog(member);
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
                                  setDeleteTarget(member);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add Staff</DialogTitle>
            <DialogDescription>Add a new staff member.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="staff-name">Name</Label>
                <Input
                  id="staff-name"
                  value={staffForm.name}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="staff-role">Role</Label>
                <Input
                  id="staff-role"
                  value={staffForm.role}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, role: event.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={staffForm.status}
                    onValueChange={(value: StaffMember["status"]) =>
                      setStaffForm({ ...staffForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Floor</Label>
                  <Select
                    value={staffForm.floor.toString()}
                    onValueChange={(value) =>
                      setStaffForm({ ...staffForm, floor: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Zone</Label>
                <Select
                  value={staffForm.zone}
                  onValueChange={(value) =>
                    setStaffForm({ ...staffForm, zone: value })
                  }
                >
                  <SelectTrigger>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="staff-workload">Workload</Label>
                  <Input
                    id="staff-workload"
                    type="number"
                    min="0"
                    value={staffForm.currentWorkload}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        currentWorkload: Number(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staff-completed">Completed Today</Label>
                  <Input
                    id="staff-completed"
                    type="number"
                    min="0"
                    value={staffForm.completedToday}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        completedToday: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>
              Update details for {editTarget?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-staff-name">Name</Label>
                <Input
                  id="edit-staff-name"
                  value={staffForm.name}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-staff-role">Role</Label>
                <Input
                  id="edit-staff-role"
                  value={staffForm.role}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, role: event.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={staffForm.status}
                    onValueChange={(value: StaffMember["status"]) =>
                      setStaffForm({ ...staffForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Floor</Label>
                  <Select
                    value={staffForm.floor.toString()}
                    onValueChange={(value) =>
                      setStaffForm({ ...staffForm, floor: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                      <SelectItem value="2">Floor 2</SelectItem>
                      <SelectItem value="3">Floor 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Zone</Label>
                <Select
                  value={staffForm.zone}
                  onValueChange={(value) =>
                    setStaffForm({ ...staffForm, zone: value })
                  }
                >
                  <SelectTrigger>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-staff-workload">Workload</Label>
                  <Input
                    id="edit-staff-workload"
                    type="number"
                    min="0"
                    value={staffForm.currentWorkload}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        currentWorkload: Number(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-staff-completed">Completed Today</Label>
                  <Input
                    id="edit-staff-completed"
                    type="number"
                    min="0"
                    value={staffForm.completedToday}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        completedToday: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
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
            <AlertDialogTitle>Delete staff member?</AlertDialogTitle>
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
                handleDeleteStaff(deleteTarget.id);
                if (selectedStaffId === deleteTarget.id) {
                  setSelectedStaffId(undefined);
                }
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
