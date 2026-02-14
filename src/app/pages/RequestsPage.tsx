import React, { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { RequestQueue } from '../components/RequestQueue';
import { NewRequestDialog } from '../components/NewRequestDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/badge';

export default function RequestsPage() {
  const {
    requests,
    handleAssignRequest,
    handleCancelRequest,
    handleNewRequest,
  } = useApp();

  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const assignedCount = requests.filter(r => r.status === 'assigned').length;
  const inProgressCount = requests.filter(r => r.status === 'in-progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader onNewRequest={() => setShowNewRequestDialog(true)} />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Transport Requests</h2>
          <p className="text-muted-foreground">Manage and assign patient transport requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{assignedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{inProgressCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Request Queue */}
        <div className="flex-1 bg-white rounded-lg border p-4 overflow-hidden">
          <RequestQueue
            requests={requests}
            onRequestSelect={(req) => setSelectedRequestId(req.id)}
            selectedRequestId={selectedRequestId}
            onAssignRequest={handleAssignRequest}
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
    </div>
  );
}
