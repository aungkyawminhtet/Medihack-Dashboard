import React from 'react';
import { TransportRequest, StaffMember, TransportEquipment } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Bed,
  Activity,
  BarChart3
} from 'lucide-react';

interface AnalyticsDashboardProps {
  requests: TransportRequest[];
  staff: StaffMember[];
  equipment: TransportEquipment[];
}

export function AnalyticsDashboard({ requests, staff, equipment }: AnalyticsDashboardProps) {
  // Calculate metrics
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const inProgressRequests = requests.filter(r => r.status === 'in-progress').length;
  const completionRate = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;

  const totalStaff = staff.length;
  const availableStaff = staff.filter(s => s.status === 'available').length;
  const busyStaff = staff.filter(s => s.status === 'busy').length;
  const avgWorkload = totalStaff > 0 
    ? staff.reduce((sum, s) => sum + s.currentWorkload, 0) / totalStaff 
    : 0;
  const totalCompleted = staff.reduce((sum, s) => sum + s.completedToday, 0);

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(eq => eq.status === 'available').length;
  const inUseEquipment = equipment.filter(eq => eq.status === 'in-use').length;
  const maintenanceEquipment = equipment.filter(eq => eq.status === 'maintenance').length;
  const utilizationRate = totalEquipment > 0 ? (inUseEquipment / totalEquipment) * 100 : 0;

  // Emergency vs routine breakdown
  const emergencyRequests = requests.filter(r => r.priority === 'emergency').length;
  const urgentRequests = requests.filter(r => r.priority === 'urgent').length;
  const routineRequests = requests.filter(r => r.priority === 'routine').length;

  // Equipment type breakdown
  const stretchers = equipment.filter(eq => eq.type === 'stretcher');
  const wheelchairs = equipment.filter(eq => eq.type === 'wheelchair');
  const stretcherUtilization = stretchers.length > 0 
    ? (stretchers.filter(s => s.status === 'in-use').length / stretchers.length) * 100 
    : 0;
  const wheelchairUtilization = wheelchairs.length > 0 
    ? (wheelchairs.filter(w => w.status === 'in-use').length / wheelchairs.length) * 100 
    : 0;

  // Average response time (mock calculation)
  const avgResponseTime = 8; // minutes (would be calculated from real timestamps)

  return (
    <div className="space-y-4">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{totalRequests}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
            </div>
            <Progress value={completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{avgResponseTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: {'<'}10 minutes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Equipment Usage</p>
                <p className="text-2xl font-bold">{utilizationRate.toFixed(0)}%</p>
              </div>
              <Bed className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
            <Progress value={utilizationRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Request Priority Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Request Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Emergency</span>
                <span className="font-semibold text-red-600">{emergencyRequests}</span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (emergencyRequests / totalRequests) * 100 : 0} 
                className="h-2 bg-red-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Urgent</span>
                <span className="font-semibold text-orange-600">{urgentRequests}</span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (urgentRequests / totalRequests) * 100 : 0} 
                className="h-2 bg-orange-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Routine</span>
                <span className="font-semibold text-blue-600">{routineRequests}</span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (routineRequests / totalRequests) * 100 : 0} 
                className="h-2 bg-blue-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Performance Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center p-3 bg-green-50 rounded border border-green-200">
              <div className="text-2xl font-bold text-green-600">{availableStaff}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{busyStaff}</div>
              <div className="text-xs text-orange-700">Busy</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{totalCompleted}</div>
              <div className="text-xs text-blue-700">Completed</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Average Workload</span>
              <span className="font-semibold">{avgWorkload.toFixed(1)} requests/staff</span>
            </div>
            <Progress value={Math.min((avgWorkload / 5) * 100, 100)} className="h-2" />
            {avgWorkload > 3 && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3" />
                <span>High workload detected - consider rebalancing</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bed className="h-4 w-4" />
            Equipment Status & Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Stretchers</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Utilization</span>
                <span className="text-xs font-semibold">{stretcherUtilization.toFixed(0)}%</span>
              </div>
              <Progress value={stretcherUtilization} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {stretchers.filter(s => s.status === 'in-use').length} of {stretchers.length} in use
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2">Wheelchairs</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Utilization</span>
                <span className="text-xs font-semibold">{wheelchairUtilization.toFixed(0)}%</span>
              </div>
              <Progress value={wheelchairUtilization} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {wheelchairs.filter(w => w.status === 'in-use').length} of {wheelchairs.length} in use
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 pt-3 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{availableEquipment}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{inUseEquipment}</div>
              <div className="text-xs text-muted-foreground">In Use</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {equipment.filter(eq => eq.status === 'requested').length}
              </div>
              <div className="text-xs text-muted-foreground">Requested</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{maintenanceEquipment}</div>
              <div className="text-xs text-muted-foreground">Maintenance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
