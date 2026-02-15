import React, { useState, useMemo } from "react";
import { AppHeader } from "../components/AppHeader";
import { RequestQueue } from "../components/RequestQueue";
import { NewRequestDialog } from "../components/NewRequestDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useApp } from "../context/AppContext";
import { Badge } from "../components/ui/badge";
import { TransportRequest } from "../types/transport";
import { UserCheck, Plus } from "lucide-react";

export default function RequestsPage() {
  const {
    requests,
    staff,
    equipment,
    handleAssignRequest,
    handleCancelRequest,
    handleNewRequest,
  } = useApp();

  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<TransportRequest | null>(
    null,
  );
  const [assignForm, setAssignForm] = useState({
    requestId: "",
    staffId: "",
    equipmentId: "",
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const assignedCount = requests.filter((r) => r.status === "assigned").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in-progress",
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "completed",
  ).length;

  const availableStaff = useMemo(
    () => staff.filter((s) => s.status === "available"),
    [staff],
  );

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "pending"),
    [requests],
  );

  const availableEquipment = useMemo(() => {
    if (!assignTarget) return [];
    return equipment.filter(
      (eq) =>
        eq.status === "available" && eq.type === assignTarget.equipmentType,
    );
  }, [equipment, assignTarget]);

  const openAssignDialog = (request?: TransportRequest) => {
    if (request) {
      setAssignTarget(request);
      setAssignForm({
        requestId: request.id,
        staffId: "",
        equipmentId: "",
      });
    } else {
      setAssignTarget(null);
      setAssignForm({
        requestId: "",
        staffId: "",
        equipmentId: "",
      });
    }
    setAssignOpen(true);
  };

  const handleAssignSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const targetRequest =
      assignTarget || requests.find((r) => r.id === assignForm.requestId);
    if (!targetRequest || !assignForm.staffId || !assignForm.equipmentId)
      return;

    handleAssignRequest(
      targetRequest.id,
      assignForm.staffId,
      assignForm.equipmentId,
    );
    setAssignOpen(false);
    setAssignTarget(null);
  };

  const handleRequestChange = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    setAssignTarget(request || null);
    setAssignForm({
      ...assignForm,
      requestId,
      staffId: "",
      equipmentId: "",
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6 animate-fadeInUpSlow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Transport Requests</h2>
            <p className="text-muted-foreground">
              Manage and assign patient transport requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewRequestDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
            <Button onClick={() => openAssignDialog()}>
              <UserCheck className="h-4 w-4 mr-2" />
              Assign Request
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="bg-orange-50">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Assigned
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-2xl font-bold text-blue-600">
                {assignedCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-2xl font-bold text-purple-600">
                {inProgressCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-2xl font-bold text-green-600">
                {completedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Queue */}
        <div className="flex-1 bg-white rounded-lg border overflow-y-auto">
          <RequestQueue
            requests={requests}
            onRequestSelect={(req) => setSelectedRequestId(req.id)}
            selectedRequestId={selectedRequestId}
            onOpenAssignDialog={openAssignDialog}
            onCancelRequest={handleCancelRequest}
          />
        </div>
      </div>

      <NewRequestDialog
        open={showNewRequestDialog}
        onClose={() => setShowNewRequestDialog(false)}
        onAddRequest={(data) => {
          handleNewRequest(data);
          setShowNewRequestDialog(false);
        }}
      />

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Request</DialogTitle>
            <DialogDescription>
              Assign staff and equipment to{" "}
              {assignTarget
                ? `request ${assignTarget.id}`
                : "a pending request"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="grid gap-4 py-4">
              {/* Request Selection - Only show if not pre-selected */}
              {!assignTarget && (
                <div className="grid gap-2">
                  <Label htmlFor="request-select">Select Request *</Label>
                  <Select
                    value={assignForm.requestId}
                    onValueChange={handleRequestChange}
                    required
                  >
                    <SelectTrigger id="request-select">
                      <SelectValue placeholder="Select pending request" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingRequests.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No pending requests
                        </SelectItem>
                      ) : (
                        pendingRequests.map((req) => (
                          <SelectItem key={req.id} value={req.id}>
                            {req.id} - {req.patientInfo.name} ({req.priority})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Patient Info */}
              {assignTarget && (
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm font-medium mb-1">
                    Patient: {assignTarget.patientInfo.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    From: Floor {assignTarget.origin.floor},{" "}
                    {assignTarget.origin.zone} → Floor{" "}
                    {assignTarget.destination.floor},{" "}
                    {assignTarget.destination.zone}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Equipment Type:{" "}
                    {assignTarget.equipmentType === "stretcher"
                      ? "Stretcher"
                      : "Wheelchair"}
                  </div>
                </div>
              )}

              {/* Staff Selection */}
              <div className="grid gap-2">
                <Label htmlFor="staff-select">Assign Staff *</Label>
                <Select
                  value={assignForm.staffId}
                  onValueChange={(value) =>
                    setAssignForm({ ...assignForm, staffId: value })
                  }
                  required
                >
                  <SelectTrigger id="staff-select">
                    <SelectValue placeholder="Select available staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaff.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No available staff
                      </SelectItem>
                    ) : (
                      availableStaff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} - {s.role} (Workload: {s.currentWorkload})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Selection */}
              <div className="grid gap-2">
                <Label htmlFor="equipment-select">Assign Equipment *</Label>
                <Select
                  value={assignForm.equipmentId}
                  onValueChange={(value) =>
                    setAssignForm({ ...assignForm, equipmentId: value })
                  }
                  required
                >
                  <SelectTrigger id="equipment-select">
                    <SelectValue placeholder="Select available equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEquipment.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No available {assignTarget?.equipmentType}s
                      </SelectItem>
                    ) : (
                      availableEquipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.id} - Floor {eq.location.floor},{" "}
                          {eq.location.zone}
                          {eq.batteryLevel !== undefined &&
                            ` (Battery: ${eq.batteryLevel}%)`}
                        </SelectItem>
                      ))
                    )}
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
              <Button
                type="submit"
                disabled={
                  (!assignTarget && !assignForm.requestId) ||
                  !assignForm.staffId ||
                  !assignForm.equipmentId
                }
              >
                Assign Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
