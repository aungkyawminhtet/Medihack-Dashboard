import { FloorConfig, DEFAULT_ZONES } from '../types/floor-config';

// Helper to create unique zones for each floor
const createFloorZones = (floorNumber: number) => {
  return DEFAULT_ZONES.map(zone => ({
    ...zone,
    id: `${zone.id}-floor-${floorNumber}`
  }));
};

export const DEFAULT_FLOOR_CONFIG: FloorConfig[] = [
  {
    id: 'floor-1',
    number: 1,
    name: 'Ground Floor',
    zones: createFloorZones(1),
    dimensions: { width: 1000, height: 600 },
    enabled: true,
  },
  {
    id: 'floor-2',
    number: 2,
    name: 'First Floor',
    zones: createFloorZones(2),
    dimensions: { width: 1000, height: 600 },
    enabled: true,
  },
  {
    id: 'floor-3',
    number: 3,
    name: 'Second Floor',
    zones: createFloorZones(3),
    dimensions: { width: 1000, height: 600 },
    enabled: true,
  },
];