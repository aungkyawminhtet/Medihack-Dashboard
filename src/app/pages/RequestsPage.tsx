import React, { useState, useMemo, useEffect } from "react";
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
import { UserCheck, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAllRequests,
  createRequest,
  assignRequest,
  cancelRequest,
} from "../api/requests";
import { getAvailableEquipment } from "../api/equipment/index";
import { getAvailablePorters } from "../api/staff";

export default function RequestsPage() {
  const { user } = useApp();

  // State for requests (now from API)
  const [requests, setRequests] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<any | null>(null);
  const [assignForm, setAssignForm] = useState({
    requestId: "",
    staffId: "",
    equipmentId: "",
  });
  const [assignLoading, setAssignLoading] = useState(false);

  // Fetch requests from API on mount
  useEffect(() => {
    fetchRequests();
    fetchStaff();
    fetchEquipment();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllRequests(token || undefined);
      // console.log("Requests response:", response);
      setRequests(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await getAvailablePorters(token || undefined);
      // console.log("Staff response:", response);
      setStaff(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch staff:", error);
      toast.error("Failed to load staff");
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await getAvailableEquipment(token || undefined);
      setEquipment(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch equipment:", error);
      toast.error("Failed to load equipment");
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const assignedCount = requests.filter((r) => r.status === "assigned").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in_progress",
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "completed",
  ).length;

  const availableStaff = useMemo(() => staff, [staff]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "pending"),
    [requests],
  );

  const availableEquipment = useMemo(() => {
    // Return all equipment without filtering by type
    return equipment;
  }, [equipment]);

  const openAssignDialog = (request?: any) => {
    if (request) {
      setAssignTarget(request);
      setAssignForm({
        requestId: request._id || request.id,
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
    // Refresh staff and equipment list when opening dialog
    fetchStaff();
    fetchEquipment();
    setAssignOpen(true);
  };

  const handleAssignSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const targetRequest =
      assignTarget ||
      requests.find((r) => (r._id || r.id) === assignForm.requestId);
    if (!targetRequest || !assignForm.staffId || !assignForm.equipmentId)
      return;

    setAssignLoading(true);
    try {
      const requestId = targetRequest._id || targetRequest.id;
      await assignRequest(
        requestId,
        {
          porter_id: assignForm.staffId,
          equipment_id: assignForm.equipmentId,
        },
        token || undefined,
      );

      toast.success("Request assigned successfully!");
      setAssignOpen(false);
      setAssignTarget(null);
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to assign request:", error);
      toast.error(error.message || "Failed to assign request");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRequestChange = (requestId: string) => {
    const request = requests.find((r) => (r._id || r.id) === requestId);
    setAssignTarget(request || null);
    setAssignForm({
      ...assignForm,
      requestId,
      staffId: "",
      equipmentId: "",
    });
  };

  const handleCancelRequestClick = async (requestId: string) => {
    try {
      await cancelRequest(requestId, token || undefined);
      toast.success("Request cancelled successfully!");
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to cancel request:", error);
      toast.error(error.message || "Failed to cancel request");
    }
  };

  const handleCreateRequest = async (data: any) => {
    try {
      await createRequest(data, token || undefined);
      toast.success("Request created successfully!");
      setShowNewRequestDialog(false);
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to create request:", error);
      toast.error(error.message || "Failed to create request");
    }
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <RequestQueue
              requests={requests}
              onRequestSelect={(req) => setSelectedRequestId(req._id || req.id)}
              selectedRequestId={selectedRequestId}
              onOpenAssignDialog={openAssignDialog}
              onCancelRequest={handleCancelRequestClick}
            />
          )}
        </div>
      </div>

      <NewRequestDialog
        open={showNewRequestDialog}
        onClose={() => setShowNewRequestDialog(false)}
        onAddRequest={handleCreateRequest}
      />

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Request</DialogTitle>
            <DialogDescription>
              Assign staff and equipment to{" "}
              {assignTarget
                ? `request ${assignTarget._id || assignTarget.id}`
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
                          <SelectItem
                            key={req._id || req.id}
                            value={req._id || req.id}
                          >
                            {req._id || req.id} -{" "}
                            {req.patient_name || req.patientInfo?.name}{" "}
                            (Priority: {req.priority})
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
                    Patient:{" "}
                    {assignTarget.patient_name ||
                      assignTarget.patientInfo?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Equipment Type:{" "}
                    {assignTarget.equipment_type || assignTarget.equipmentType}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Priority:{" "}
                    {assignTarget.priority === 1
                      ? "STAT"
                      : assignTarget.priority === 2
                        ? "HIGH"
                        : assignTarget.priority === 3
                          ? "NORMAL"
                          : "LOW"}
                  </div>
                  {assignTarget.notes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Notes: {assignTarget.notes}
                    </div>
                  )}
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
                        <SelectItem key={s._id || s.id} value={s._id || s.id}>
                          {s.name} - {s.full_name}
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
                        No available{" "}
                        {assignTarget?.equipment_type ||
                          assignTarget?.equipmentType ||
                          "equipment"}
                      </SelectItem>
                    ) : (
                      availableEquipment.map((eq) => (
                        <SelectItem
                          key={eq._id || eq.id}
                          value={eq._id || eq.id}
                        >
                          {eq.type}
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
                  assignLoading ||
                  (!assignTarget && !assignForm.requestId) ||
                  !assignForm.staffId ||
                  !assignForm.equipmentId
                }
              >
                {assignLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
