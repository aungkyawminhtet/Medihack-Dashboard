export interface AccessPoint {
  id: string;
  name: string;
  model: 'AP-535' | 'AP-503H';
  location: {
    floor: number;
    zone: string;
    x: number;
    y: number;
  };
  status: 'online' | 'offline' | 'maintenance';
  bleRange: number; // in pixels for visualization (meters in real world)
  clients: number; // number of connected devices
  signalStrength: number; // percentage
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  lastSeen: string;
}

export const AP_MODELS = {
  'AP-535': {
    name: 'Aruba AP-535',
    bleRange: 150, // ~50 meters
    maxClients: 512,
    bands: ['2.4GHz', '5GHz', 'BLE', 'IoT'],
  },
  'AP-503H': {
    name: 'Aruba AP-503H',
    bleRange: 120, // ~40 meters
    maxClients: 256,
    bands: ['2.4GHz', '5GHz', 'BLE', 'Zigbee'],
  },
};
