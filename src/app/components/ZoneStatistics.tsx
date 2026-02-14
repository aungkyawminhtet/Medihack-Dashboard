import React from 'react';
import { TransportEquipment, StaffMember } from '../types/transport';
import { FloorConfig } from '../types/floor-config';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';

interface ZoneStatisticsProps {
  equipment: TransportEquipment[];
  staff: StaffMember[];
  selectedFloor: number;
  floorConfig: FloorConfig[];
}

export function ZoneStatistics({ equipment, staff, selectedFloor, floorConfig }: ZoneStatisticsProps) {
  const currentFloorConfig = floorConfig.find(f => f.number === selectedFloor);
  const zones = currentFloorConfig?.zones || [];

  const getZoneStats = (zoneName: string) => {
    const zoneEquipment = equipment.filter(
      eq => eq.location.floor === selectedFloor && eq.location.zone === zoneName
    );
    const zoneStaff = staff.filter(
      s => s.location.floor === selectedFloor && s.location.zone === zoneName
    );

    return {
      equipment: zoneEquipment.length,
      staff: zoneStaff.length,
      availableEquipment: zoneEquipment.filter(eq => eq.status === 'available').length,
      availableStaff: zoneStaff.filter(s => s.status === 'available').length,
    };
  };

  if (zones.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Zone Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-4">
            No zones configured for this floor
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Zone Statistics - Floor {selectedFloor}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {zones.map(zone => {
              const stats = getZoneStats(zone.name);
              return (
                <div
                  key={zone.id}
                  className="border rounded-lg p-2"
                  style={{ borderLeftColor: zone.color, borderLeftWidth: '3px' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-xs font-medium">{zone.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Capacity: {zone.capacity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-gray-50 rounded p-1">
                      <div className="text-muted-foreground">Equipment</div>
                      <div className="font-semibold">
                        {stats.availableEquipment}/{stats.equipment}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-1">
                      <div className="text-muted-foreground">Staff</div>
                      <div className="font-semibold">
                        {stats.availableStaff}/{stats.staff}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
