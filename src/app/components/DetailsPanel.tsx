import React from 'react';
import { TransportEquipment, StaffMember, PlacementSuggestion } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Bed, 
  Accessibility, 
  Battery, 
  MapPin, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { cn } from './ui/utils';

interface EquipmentDetailsProps {
  equipment: TransportEquipment | null;
  onClose: () => void;
}

interface StaffDetailsProps {
  staff: StaffMember | null;
  onClose: () => void;
}

export function EquipmentDetails({ equipment, onClose }: EquipmentDetailsProps) {
  if (!equipment) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select equipment to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: TransportEquipment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-use':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'requested':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const daysSinceMaintenance = Math.floor(
    (new Date().getTime() - equipment.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              equipment.type === 'stretcher' ? 'bg-purple-100' : 'bg-blue-100'
            )}>
              {equipment.type === 'stretcher' ? (
                <Bed className="h-6 w-6 text-purple-600" />
              ) : (
                <Accessibility className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{equipment.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{equipment.type}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {/* Status */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Badge 
            variant="outline" 
            className={cn('mt-1 w-full justify-center py-1', getStatusColor(equipment.status))}
          >
            <span className="capitalize">{equipment.status}</span>
          </Badge>
        </div>

        {/* Battery Level (for stretchers) */}
        {equipment.type === 'stretcher' && equipment.batteryLevel !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Battery className="h-3 w-3" />
                Battery Level
              </label>
              <span className={cn('text-sm font-semibold', getBatteryColor(equipment.batteryLevel))}>
                {equipment.batteryLevel}%
              </span>
            </div>
            <Progress value={equipment.batteryLevel} className="h-2" />
            {equipment.batteryLevel < 30 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <AlertTriangle className="h-3 w-3" />
                <span>Low battery - charge soon</span>
              </div>
            )}
          </div>
        )}

        {/* Location */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="h-3 w-3" />
            Current Location
          </label>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm font-medium">{equipment.location.zone}</div>
            <div className="text-xs text-muted-foreground">
              Floor {equipment.location.floor} • Position ({equipment.location.x}, {equipment.location.y})
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
            <Wrench className="h-3 w-3" />
            Maintenance
          </label>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm">
              Last Service: {equipment.lastMaintenance.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {daysSinceMaintenance} days ago
            </div>
            {daysSinceMaintenance > 30 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                <AlertTriangle className="h-3 w-3" />
                <span>Maintenance due soon</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Staff */}
        {equipment.assignedStaff && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Assigned Staff
            </label>
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-sm font-medium text-blue-900">
                Staff ID: {equipment.assignedStaff}
              </div>
            </div>
          </div>
        )}

        {/* Current Request */}
        {equipment.currentRequest && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Active Request
            </label>
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <div className="text-sm font-medium text-purple-900">
                Request ID: {equipment.currentRequest}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t space-y-2">
          {equipment.status === 'available' && (
            <Button className="w-full" variant="default">
              Assign to Request
            </Button>
          )}
          {equipment.status === 'maintenance' && (
            <Button className="w-full" variant="outline">
              <Wrench className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          )}
          <Button className="w-full" variant="outline">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StaffDetails({ staff, onClose }: StaffDetailsProps) {
  if (!staff) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select staff to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'busy':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'off-duty':
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const workloadPercentage = Math.min((staff.currentWorkload / 5) * 100, 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-blue-600">
                {staff.name.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{staff.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {/* Status */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Badge 
            variant="outline" 
            className={cn('mt-1 w-full justify-center py-1', getStatusColor(staff.status))}
          >
            <span className="capitalize">{staff.status}</span>
          </Badge>
        </div>

        {/* Current Workload */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground">
              Current Workload
            </label>
            <span className="text-sm font-semibold">
              {staff.currentWorkload} / 5 requests
            </span>
          </div>
          <Progress value={workloadPercentage} className="h-2" />
          {staff.currentWorkload > 3 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
              <AlertTriangle className="h-3 w-3" />
              <span>High workload</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="h-3 w-3" />
            Current Location
          </label>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm font-medium">{staff.location.zone}</div>
            <div className="text-xs text-muted-foreground">
              Floor {staff.location.floor}
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
            <TrendingUp className="h-3 w-3" />
            Today's Performance
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="flex items-center gap-1 text-green-600 mb-1">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-xs">Completed</span>
              </div>
              <div className="text-lg font-semibold text-green-900">
                {staff.completedToday}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="flex items-center gap-1 text-blue-600 mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Active</span>
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {staff.currentWorkload}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Equipment */}
        {staff.assignedEquipment && staff.assignedEquipment.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Assigned Equipment
            </label>
            <div className="space-y-2">
              {staff.assignedEquipment.map(equipId => (
                <div key={equipId} className="bg-purple-50 p-3 rounded border border-purple-200">
                  <div className="text-sm font-medium text-purple-900">
                    {equipId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t space-y-2">
          {staff.status === 'available' && (
            <Button className="w-full" variant="default">
              Assign Request
            </Button>
          )}
          <Button className="w-full" variant="outline">
            View Full Schedule
          </Button>
          <Button className="w-full" variant="outline">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}