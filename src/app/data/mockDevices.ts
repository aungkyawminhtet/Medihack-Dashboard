import { Device } from "../types/device";

// Reusable device data
export const devicesData: Device[] = [
  {
    id: "dev-001",
    name: "iPhone 14 Pro",
    type: "mobile",
    status: "online",
    location: { lat: 40.758, lng: -73.9855 }, // Times Square
    battery: 85,
    lastSeen: new Date(),
    speed: 15,
    userId: "user-001",
  },
  {
    id: "dev-002",
    name: "iPad Air",
    type: "tablet",
    status: "online",
    location: { lat: 40.7614, lng: -73.9776 }, // Central Park
    battery: 62,
    lastSeen: new Date(),
    speed: 0,
    userId: "user-002",
  },
  {
    id: "dev-003",
    name: "MacBook Pro",
    type: "laptop",
    status: "warning",
    location: { lat: 40.7489, lng: -73.968 }, // Empire State Building
    battery: 25,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    speed: 0,
    userId: "user-003",
  },
  {
    id: "dev-004",
    name: "Samsung Galaxy",
    type: "mobile",
    status: "online",
    location: { lat: 40.7484, lng: -73.9857 }, // Madison Square Garden
    battery: 94,
    lastSeen: new Date(),
    speed: 25,
    userId: "user-004",
  },
  {
    id: "dev-005",
    name: "IoT Sensor #1",
    type: "iot",
    status: "offline",
    location: { lat: 40.741, lng: -74.0057 }, // Brooklyn Bridge
    battery: 5,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    speed: 0,
    userId: "user-005",
  },
  {
    id: "dev-006",
    name: "Surface Pro",
    type: "tablet",
    status: "online",
    location: { lat: 40.7589, lng: -73.9851 },
    battery: 78,
    lastSeen: new Date(),
    speed: 5,
    userId: "user-006",
  },
  {
    id: "dev-007",
    name: "Pixel 8",
    type: "mobile",
    status: "online",
    location: { lat: 40.7527, lng: -73.9772 },
    battery: 56,
    lastSeen: new Date(),
    speed: 30,
    userId: "user-007",
  },
  {
    id: "dev-008",
    name: "IoT Sensor #2",
    type: "iot",
    status: "warning",
    location: { lat: 40.7433, lng: -73.9874 },
    battery: 18,
    lastSeen: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    speed: 0,
    userId: "user-008",
  },
];

// Function to simulate device movement
export function simulateDeviceMovement(devices: Device[]): Device[] {
  return devices.map((device) => {
    if (device.status === "offline" || device.speed === 0) {
      return device;
    }

    // Small random movement
    const latChange = (Math.random() - 0.5) * 0.001;
    const lngChange = (Math.random() - 0.5) * 0.001;

    return {
      ...device,
      location: {
        lat: device.location.lat + latChange,
        lng: device.location.lng + lngChange,
      },
      lastSeen: new Date(),
    };
  });
}
