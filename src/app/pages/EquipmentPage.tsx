import React, { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { EquipmentList } from '../components/EquipmentList';
import { AddEquipmentDialog } from '../components/AddEquipmentDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EquipmentPage() {
  const { equipment, handleAddEquipment } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>();

  const availableCount = equipment.filter(eq => eq.status === 'available').length;
  const inUseCount = equipment.filter(eq => eq.status === 'in-use').length;
  const requestedCount = equipment.filter(eq => eq.status === 'requested').length;
  const maintenanceCount = equipment.filter(eq => eq.status === 'maintenance').length;

  const stretcherCount = equipment.filter(eq => eq.type === 'stretcher').length;
  const wheelchairCount = equipment.filter(eq => eq.type === 'wheelchair').length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <AppHeader />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Equipment Management</h2>
            <p className="text-muted-foreground">Track and manage stretchers and wheelchairs</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{equipment.length}</div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">In Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inUseCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{requestedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stretchers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stretcherCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wheelchairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{wheelchairCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment List */}
        <div className="flex-1 bg-white rounded-lg border p-4 overflow-hidden">
          <EquipmentList
            equipment={equipment}
            onEquipmentSelect={(eq) => setSelectedEquipmentId(eq.id)}
            selectedEquipmentId={selectedEquipmentId}
          />
        </div>
      </div>

      <AddEquipmentDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddEquipment={(data) => {
          handleAddEquipment(data);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
}
