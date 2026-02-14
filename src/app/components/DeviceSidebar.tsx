import { Device, DeviceStatus } from '../types/device';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Smartphone, Tablet, Laptop, Radio, Search, Battery, Clock, Navigation } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceSidebarProps {
  devices: Device[];
  selectedDevice: Device | null;
  onDeviceSelect: (device: Device) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: DeviceStatus | 'all';
  onStatusFilterChange: (status: DeviceStatus | 'all') => void;
}

function getDeviceIcon(type: Device['type']) {
  switch (type) {
    case 'mobile':
      return <Smartphone className="w-4 h-4" />;
    case 'tablet':
      return <Tablet className="w-4 h-4" />;
    case 'laptop':
      return <Laptop className="w-4 h-4" />;
    case 'iot':
      return <Radio className="w-4 h-4" />;
  }
}

function getStatusColor(status: DeviceStatus) {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-red-500';
  }
}

function getBatteryColor(battery: number) {
  if (battery > 60) return 'text-green-600';
  if (battery > 20) return 'text-yellow-600';
  return 'text-red-600';
}

export function DeviceSidebar({
  devices,
  selectedDevice,
  onDeviceSelect,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: DeviceSidebarProps) {
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          device.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    warning: devices.filter(d => d.status === 'warning').length,
    offline: devices.filter(d => d.status === 'offline').length,
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Device Tracking</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`p-2 rounded-lg border text-center transition-colors ${
              statusFilter === 'all' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-lg font-bold">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </button>
          <button
            onClick={() => onStatusFilterChange('online')}
            className={`p-2 rounded-lg border text-center transition-colors ${
              statusFilter === 'online' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-lg font-bold text-green-600">{stats.online}</div>
            <div className="text-xs text-gray-600">Online</div>
          </button>
          <button
            onClick={() => onStatusFilterChange('warning')}
            className={`p-2 rounded-lg border text-center transition-colors ${
              statusFilter === 'warning' ? 'bg-yellow-50 border-yellow-500' : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-lg font-bold text-yellow-600">{stats.warning}</div>
            <div className="text-xs text-gray-600">Warning</div>
          </button>
          <button
            onClick={() => onStatusFilterChange('offline')}
            className={`p-2 rounded-lg border text-center transition-colors ${
              statusFilter === 'offline' ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-lg font-bold text-red-600">{stats.offline}</div>
            <div className="text-xs text-gray-600">Offline</div>
          </button>
        </div>
      </div>

      {/* Device List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No devices found
            </div>
          ) : (
            filteredDevices.map(device => (
              <Card
                key={device.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedDevice?.id === device.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onDeviceSelect(device)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getDeviceIcon(device.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{device.name}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Battery className={`w-3 h-3 ${getBatteryColor(device.battery)}`} />
                        <span className={getBatteryColor(device.battery)}>{device.battery}%</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(device.lastSeen, { addSuffix: true })}</span>
                      </div>
                      
                      {device.speed !== undefined && device.speed > 0 && (
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          <span>{device.speed} km/h</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={
                      device.status === 'online' ? 'default' : 
                      device.status === 'warning' ? 'secondary' : 
                      'destructive'
                    }
                    className="text-xs"
                  >
                    {device.status}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Device Details Panel */}
      {selectedDevice && (
        <div className="p-4 border-t bg-gray-50">
          <h3 className="font-semibold mb-3">Device Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono text-xs">{selectedDevice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize">{selectedDevice.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-mono text-xs">
                {selectedDevice.location.lat.toFixed(4)}, {selectedDevice.location.lng.toFixed(4)}
              </span>
            </div>
            {selectedDevice.userId && (
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs">{selectedDevice.userId}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}