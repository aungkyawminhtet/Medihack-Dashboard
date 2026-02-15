import React from "react";
import {
  TransportRequest,
  RequestPriority,
  RequestStatus,
} from "../types/transport";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Clock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Bed,
  Accessibility,
  XCircle,
  Play,
} from "lucide-react";
import { cn } from "./ui/utils";

interface RequestQueueProps {
  requests: TransportRequest[];
  onRequestSelect: (request: TransportRequest) => void;
  selectedRequestId?: string;
  onAssignRequest?: (requestId: string) => void;
  onOpenAssignDialog?: (request: TransportRequest) => void;
  onCancelRequest?: (requestId: string) => void;
}

export function RequestQueue({
  requests,
  onRequestSelect,
  selectedRequestId,
  onOpenAssignDialog,
  onCancelRequest,
}: RequestQueueProps) {
  const getPriorityDot = (priority: RequestPriority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-500";
      case "urgent":
        return "bg-orange-500";
      case "routine":
        return "bg-blue-500";
    }
  };

  const getPriorityBadge = (priority: RequestPriority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-50 text-red-700 border-red-200";
      case "urgent":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "routine":
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "assigned":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "assigned":
        return <User className="h-3.5 w-3.5" />;
      case "in-progress":
        return <Play className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5" />;
    }
  };

  // Sort requests by priority and time
  const sortedRequests = [...requests].sort((a, b) => {
    // Handle priority - can be string or number
    const priorityOrder: any = {
      emergency: 0,
      urgent: 1,
      routine: 2,
      1: 0,
      2: 1,
      3: 2,
      4: 3,
    };
    const aPriority = priorityOrder[a.priority] ?? 99;
    const bPriority = priorityOrder[b.priority] ?? 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Handle timestamps - may be Date, string, or undefined
    const aTime = a.requestedAt
      ? a.requestedAt instanceof Date
        ? a.requestedAt.getTime()
        : new Date(a.requestedAt).getTime()
      : 0;
    const bTime = b.requestedAt
      ? b.requestedAt instanceof Date
        ? b.requestedAt.getTime()
        : new Date(b.requestedAt).getTime()
      : 0;

    return aTime - bTime;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in_progress" || r.status === "in-progress",
  ).length;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-slate-900">
            Transport Queue
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              {pendingCount} Pending
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {inProgressCount} Active
            </Badge>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {sortedRequests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No transport requests</p>
            <p className="text-sm mt-1">Create a new request to get started</p>
          </div>
        ) : (
          <div className="p-4 grid gap-3">
            {sortedRequests.map((request) => (
              <div
                key={request._id || request.id}
                className={cn(
                  "rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md",
                  selectedRequestId === (request._id || request.id) &&
                    "ring-2 ring-slate-900/10",
                )}
                onClick={() => onRequestSelect(request)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white",
                        getPriorityDot(request.priority),
                      )}
                    >
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {request.patient_name ||
                              request.patientInfo?.name ||
                              "Unknown Patient"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {request.patientInfo?.id}{" "}
                            {request.patientInfo?.roomNumber &&
                              `• Room ${request.patientInfo.roomNumber}`}
                            {request.patientInfo?.age &&
                              ` • Age ${request.patientInfo.age}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium",
                              getPriorityBadge(request.priority),
                            )}
                          >
                            {request.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs flex items-center gap-1",
                              getStatusBadge(request.status),
                            )}
                          >
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1">
                          <MapPin className="h-3.5 w-3.5 text-blue-600" />
                          <div className="truncate">
                            {request.pickup_room_id ||
                              (request.origin &&
                                `${request.origin.zone} • Floor ${request.origin.floor}`) ||
                              "Origin"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1">
                          <MapPin className="h-3.5 w-3.5 text-green-600" />
                          <div className="truncate">
                            {request.destination_room_id ||
                              (request.destination &&
                                `${request.destination.zone} • Floor ${request.destination.floor}`) ||
                              "Destination"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {request.requestedBy && (
                            <>
                              <User className="h-3.5 w-3.5" />
                              <span>{request.requestedBy}</span>
                              <span className="text-slate-300">•</span>
                            </>
                          )}
                          {request.requestedAt && (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {request.requestedAt instanceof Date
                                  ? request.requestedAt.toLocaleTimeString()
                                  : new Date(
                                      request.requestedAt,
                                    ).toLocaleTimeString()}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-full border px-2 py-0.5 bg-white">
                            {(request.equipment_type ||
                              request.equipmentType) === "stretcher" ? (
                              <Bed className="h-3.5 w-3.5" />
                            ) : (
                              <Accessibility className="h-3.5 w-3.5" />
                            )}
                            <span className="capitalize">
                              {request.equipment_type || request.equipmentType}
                            </span>
                          </div>
                          {request.estimatedDuration && (
                            <div className="rounded-full border px-2 py-0.5 bg-white">
                              ~{request.estimatedDuration} min
                            </div>
                          )}
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{request.notes}</span>
                          </div>
                        </div>
                      )}

                      {request.assignedStaff && (
                        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span>
                              Assigned to Staff ID:{" "}
                              {request.porter_id || request.assignedStaff}
                            </span>
                          </div>
                        </div>
                      )}

                      {request.status === "pending" && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAssignDialog?.(request);
                            }}
                          >
                            <Play className="h-3.5 w-3.5 mr-1.5" />
                            Assign
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelRequest?.(request._id || request.id);
                            }}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1.5" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
