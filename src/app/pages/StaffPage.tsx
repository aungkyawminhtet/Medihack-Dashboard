import React, { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { StaffWorkload } from '../components/StaffWorkload';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';

export default function StaffPage() {
  const { staff } = useApp();
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>();

  const availableCount = staff.filter(s => s.status === 'available').length;
  const busyCount = staff.filter(s => s.status === 'busy').length;
  const totalWorkload = staff.reduce((sum, s) => sum + s.currentWorkload, 0);
  const totalCompleted = staff.reduce((sum, s) => sum + s.completedToday, 0);
  const avgWorkload = staff.length > 0 ? (totalWorkload / staff.length).toFixed(1) : '0';

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Staff Management</h2>
          <p className="text-muted-foreground">Monitor staff workload and availability</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{staff.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Busy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{busyCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{avgWorkload}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalCompleted}</div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <div className="flex-1 bg-white rounded-lg border p-4 overflow-hidden">
          <StaffWorkload
            staff={staff}
            onStaffSelect={(s) => setSelectedStaffId(s.id)}
            selectedStaffId={selectedStaffId}
          />
        </div>
      </div>
    </div>
  );
}
