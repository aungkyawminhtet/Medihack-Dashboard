import React from 'react';
import { StaffMember } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { User, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from './ui/utils';

interface StaffWorkloadProps {
  staff: StaffMember[];
  onStaffSelect: (staff: StaffMember) => void;
  selectedStaffId?: string;
}

export function StaffWorkload({ staff, onStaffSelect, selectedStaffId }: StaffWorkloadProps) {
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

  const getWorkloadColor = (workload: number) => {
    if (workload === 0) return 'text-green-600';
    if (workload <= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getWorkloadProgress = (workload: number) => {
    const max = 5; // Maximum workload capacity
    return Math.min((workload / max) * 100, 100);
  };

  // Sort staff: available first, then by workload
  const sortedStaff = [...staff].sort((a, b) => {
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    return a.currentWorkload - b.currentWorkload;
  });

  const availableCount = staff.filter(s => s.status === 'available').length;
  const busyCount = staff.filter(s => s.status === 'busy').length;
  const totalWorkload = staff.reduce((sum, s) => sum + s.currentWorkload, 0);
  const avgWorkload = staff.length > 0 ? (totalWorkload / staff.length).toFixed(1) : '0';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg">Staff Workload</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            {staff.length} Staff
          </Badge>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-green-50 border border-green-200 rounded p-2">
            <div className="text-green-600 font-semibold">{availableCount}</div>
            <div className="text-green-700">Available</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded p-2">
            <div className="text-orange-600 font-semibold">{busyCount}</div>
            <div className="text-orange-700">Busy</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="text-blue-600 font-semibold">{avgWorkload}</div>
            <div className="text-blue-700">Avg Load</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {sortedStaff.map(member => (
              <Card
                key={member.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedStaffId === member.id && 'ring-2 ring-blue-500 shadow-md'
                )}
                onClick={() => onStaffSelect(member)}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(member.status)}
                    >
                      {member.status}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Location:</span>
                      <span>Floor {member.location.floor} • {member.location.zone}</span>
                    </div>
                  </div>

                  {/* Workload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Current Workload</span>
                      <span className={cn('font-semibold', getWorkloadColor(member.currentWorkload))}>
                        {member.currentWorkload} {member.currentWorkload === 1 ? 'request' : 'requests'}
                      </span>
                    </div>
                    <Progress 
                      value={getWorkloadProgress(member.currentWorkload)}
                      className="h-2"
                    />
                    
                    {member.currentWorkload > 2 && (
                      <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <AlertTriangle className="h-3 w-3" />
                        <span>High workload - consider rebalancing</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-semibold">{member.completedToday}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">Active:</span>
                      <span className="font-semibold">{member.currentWorkload}</span>
                    </div>
                  </div>

                  {/* Assigned Equipment */}
                  {member.assignedEquipment && member.assignedEquipment.length > 0 && (
                    <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-200">
                      <span className="text-blue-700">
                        Equipment: {member.assignedEquipment.join(', ')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
