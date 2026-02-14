export interface Zone {
  id: string;
  name: string;
  color: string;
  capacity: number;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FloorConfig {
  id: string;
  number: number;
  name: string;
  zones: Zone[];
  dimensions: {
    width: number;
    height: number;
  };
  enabled: boolean;
}

export const DEFAULT_ZONES: Zone[] = [
  { id: 'emergency', name: 'Emergency', color: '#ef4444', capacity: 10, bounds: { x: 50, y: 100, width: 300, height: 200 } },
  { id: 'icu', name: 'ICU', color: '#f59e0b', capacity: 8, bounds: { x: 550, y: 400, width: 250, height: 150 } },
  { id: 'surgery', name: 'Surgery', color: '#8b5cf6', capacity: 6, bounds: { x: 300, y: 250, width: 250, height: 200 } },
  { id: 'radiology', name: 'Radiology', color: '#06b6d4', capacity: 5, bounds: { x: 450, y: 200, width: 200, height: 150 } },
  { id: 'general', name: 'General Ward', color: '#10b981', capacity: 15, bounds: { x: 100, y: 300, width: 180, height: 150 } },
  { id: 'pediatrics', name: 'Pediatrics', color: '#ec4899', capacity: 8, bounds: { x: 700, y: 350, width: 200, height: 100 } },
  { id: 'maternity', name: 'Maternity', color: '#f97316', capacity: 10, bounds: { x: 600, y: 150, width: 250, height: 200 } },
  { id: 'outpatient', name: 'Outpatient', color: '#6366f1', capacity: 12, bounds: { x: 50, y: 450, width: 200, height: 100 } },
];