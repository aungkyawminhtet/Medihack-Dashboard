import React from "react";
import {
  TransportRequest,
  RequestPriority,
  RequestStatus,
} from "../types/transport";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Clock,
  User,
  MapPin,
  ArrowRight,
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
  onAssignRequest,
  onOpenAssignDialog,
  onCancelRequest,
}: RequestQueueProps) {
  const getPriorityColor = (priority: RequestPriority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-500 text-white hover:bg-red-600";
      case "urgent":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "routine":
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "assigned":
        return <User className="h-3 w-3" />;
      case "in-progress":
        return <Play className="h-3 w-3" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
    }
  };

  // Sort requests by priority and time
  const sortedRequests = [...requests].sort((a, b) => {
    const priorityOrder = { emergency: 0, urgent: 1, routine: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.requestedAt.getTime() - b.requestedAt.getTime();
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in-progress",
  ).length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transport Queue</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-300"
            >
              {pendingCount} Pending
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-300"
            >
              {inProgressCount} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {sortedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No transport requests</p>
              </div>
            ) : (
              sortedRequests.map((request) => (
                <Card
                  key={request.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRequestId === request.id &&
                      "ring-2 ring-blue-500 shadow-md",
                  )}
                  onClick={() => onRequestSelect(request)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "flex items-center gap-1",
                            getStatusColor(request.status),
                          )}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {request.equipmentType === "stretcher" ? (
                          <Bed className="h-3 w-3" />
                        ) : (
                          <Accessibility className="h-3 w-3" />
                        )}
                        <span className="capitalize">
                          {request.equipmentType}
                        </span>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="mb-3">
                      <div className="font-semibold text-sm">
                        {request.patientInfo.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {request.patientInfo.id} • Room:{" "}
                        {request.patientInfo.roomNumber}
                        {request.patientInfo.age &&
                          ` • Age: ${request.patientInfo.age}`}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2 text-xs mb-3 bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-1 flex-1">
                        <MapPin className="h-3 w-3 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {request.origin.zone}
                          </div>
                          <div className="text-muted-foreground truncate">
                            Floor {request.origin.floor} • {request.origin.room}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex items-center gap-1 flex-1">
                        <MapPin className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {request.destination.zone}
                          </div>
                          <div className="text-muted-foreground truncate">
                            Floor {request.destination.floor} •{" "}
                            {request.destination.room}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{request.requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{request.requestedAt.toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {request.estimatedDuration && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Est. Duration: {request.estimatedDuration} min
                      </div>
                    )}

                    {/* Notes */}
                    {request.notes && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                        <div className="flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-amber-800">
                            {request.notes}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {request.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAssignDialog?.(request);
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelRequest?.(request.id);
                          }}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {/* Assigned Info */}
                    {request.assignedStaff && (
                      <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-200">
                        <span className="text-blue-700">
                          Assigned to Staff ID: {request.assignedStaff}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
