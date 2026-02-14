import React from 'react';
import { AccessPoint, AP_MODELS } from '../types/access-point';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Wifi, 
  Radio,
  MapPin, 
  Activity,
  Users,
  X,
  Signal,
  Server,
  Zap
} from 'lucide-react';
import { cn } from './ui/utils';

interface AccessPointDetailsProps {
  accessPoint: AccessPoint;
  onClose: () => void;
}

export function AccessPointDetails({ accessPoint, onClose }: AccessPointDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const modelInfo = AP_MODELS[accessPoint.model];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {accessPoint.model === 'AP-535' ? (
              <Radio className="h-5 w-5 text-blue-600" />
            ) : (
              <Wifi className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{accessPoint.name}</h3>
            <p className="text-xs text-muted-foreground">{accessPoint.id}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', getStatusColor(accessPoint.status))} />
                  <span className="text-sm capitalize">{accessPoint.status}</span>
                </div>
                <Badge variant="secondary">{modelInfo.name}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Signal className={cn('h-4 w-4', getSignalColor(accessPoint.signalStrength))} />
                  <span>Signal Strength</span>
                </div>
                <span className={cn('font-semibold', getSignalColor(accessPoint.signalStrength))}>
                  {accessPoint.signalStrength}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Connected Clients</span>
                </div>
                <span className="font-semibold">
                  {accessPoint.clients} / {modelInfo.maxClients}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>BLE Range</span>
                </div>
                <span className="font-semibold">~{Math.round(accessPoint.bleRange / 3)}m</span>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Floor {accessPoint.location.floor} - {accessPoint.location.zone}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Coordinates: ({Math.round(accessPoint.location.x)}, {Math.round(accessPoint.location.y)})
              </div>
            </CardContent>
          </Card>

          {/* Network Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Network Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <span className="font-mono">{accessPoint.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MAC Address:</span>
                <span className="font-mono text-xs">{accessPoint.macAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Firmware:</span>
                <span className="font-mono">{accessPoint.firmwareVersion}</span>
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {modelInfo.bands.map((band) => (
                  <Badge key={band} variant="secondary">
                    {band}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Seen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Last seen: {new Date(accessPoint.lastSeen).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Server className="h-4 w-4 mr-2" />
              View Logs
            </Button>
            <Button variant="outline" className="w-full">
              <Activity className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
