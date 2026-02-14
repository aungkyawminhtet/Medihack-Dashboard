import React from 'react';
import { TransportEquipment } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bed, 
  Accessibility, 
  Battery, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  Wrench,
  TrendingUp
} from 'lucide-react';
import { cn } from './ui/utils';

interface EquipmentListProps {
  equipment: TransportEquipment[];
  onEquipmentSelect: (equipment: TransportEquipment) => void;
  selectedEquipmentId?: string;
  filterStatus?: 'all' | 'available' | 'in-use' | 'maintenance' | 'requested';
}

export function EquipmentList({ 
  equipment, 
  onEquipmentSelect, 
  selectedEquipmentId,
  filterStatus = 'all'
}: EquipmentListProps) {
  const filteredEquipment = filterStatus === 'all' 
    ? equipment 
    : equipment.filter(eq => eq.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in-use':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-red-500';
      case 'requested':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'maintenance':
        return <Wrench className="h-3 w-3" />;
      case 'requested':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Equipment Overview</h3>
          <Badge variant="secondary">{filteredEquipment.length} items</Badge>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-700">
              {equipment.filter(eq => eq.status === 'available').length}
            </div>
            <div className="text-green-600">Available</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700">
              {equipment.filter(eq => eq.status === 'in-use').length}
            </div>
            <div className="text-blue-600">In Use</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="font-semibold text-orange-700">
              {equipment.filter(eq => eq.status === 'requested').length}
            </div>
            <div className="text-orange-600">Requested</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="font-semibold text-red-700">
              {equipment.filter(eq => eq.status === 'maintenance').length}
            </div>
            <div className="text-red-600">Maintenance</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredEquipment.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Bed className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No equipment found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredEquipment.map((eq) => (
              <Card
                key={eq.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedEquipmentId === eq.id && 'ring-2 ring-blue-500 shadow-md'
                )}
                onClick={() => onEquipmentSelect(eq)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      eq.type === 'stretcher' ? 'bg-purple-100' : 'bg-blue-100'
                    )}>
                      {eq.type === 'stretcher' ? (
                        <Bed className={cn('h-5 w-5', eq.type === 'stretcher' ? 'text-purple-600' : 'text-blue-600')} />
                      ) : (
                        <Accessibility className={cn('h-5 w-5', eq.type === 'stretcher' ? 'text-purple-600' : 'text-blue-600')} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">{eq.id}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{eq.type}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-white text-xs', getStatusColor(eq.status))}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(eq.status)}
                            {eq.status}
                          </span>
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Floor {eq.location.floor} - {eq.location.zone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Battery className={cn('h-3 w-3', getBatteryColor(eq.batteryLevel))} />
                          <span className={getBatteryColor(eq.batteryLevel)}>
                            {eq.batteryLevel}% Battery
                          </span>
                        </div>

                        {eq.assignedStaff && (
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-blue-600">Assigned to staff</span>
                          </div>
                        )}

                        {eq.status === 'maintenance' && (
                          <div className="flex items-center gap-2 text-xs">
                            <Wrench className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">{eq.maintenanceNote || 'Under maintenance'}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Used */}
                      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                        Last used: {new Date(eq.lastUsed).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
