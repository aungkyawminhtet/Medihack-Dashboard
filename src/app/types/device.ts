export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'laptop' | 'iot';
  status: DeviceStatus;
  location: {
    lat: number;
    lng: number;
  };
  battery: number;
  lastSeen: Date;
  speed?: number;
  userId?: string;
}
