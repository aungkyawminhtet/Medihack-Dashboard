// Transport Equipment Types
export type EquipmentType = "stretcher" | "wheelchair";

export type EquipmentStatus =
  | "available"
  | "in-use"
  | "requested"
  | "maintenance";

export type RequestPriority = "routine" | "urgent" | "emergency";

export type RequestStatus =
  | "pending"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

// Transport Equipment
export interface TransportEquipment {
  id: string;
  type: EquipmentType;
  name: string;
  model?: string;
  status: EquipmentStatus;
  location: {
    x: number; // SVG coordinates
    y: number;
    floor: number;
    zone: string; // e.g., "Emergency", "Surgery", "ICU"
  };
  batteryLevel?: number; // For powered equipment
  lastMaintenance: Date;
  lastUsed?: string;
  maintenanceNote?: string;
  assignedStaff?: string; // Staff ID
  currentRequest?: string; // Request ID
}

// Staff Member
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "off-duty";
  location: {
    x: number;
    y: number;
    floor: number;
    zone: string;
  };
  currentWorkload: number; // Number of active requests
  completedToday: number;
  assignedEquipment?: string[]; // Equipment IDs
}

// Transport Request
export interface TransportRequest {
  id: string;
  _id?: string; // MongoDB ID from API
  priority: RequestPriority | number; // Can be enum or number from API
  status: RequestStatus;

  // API fields
  patient_name?: string;
  equipment_type?: string;
  pickup_room_id?: string;
  destination_room_id?: string;
  porter_id?: string;
  equipment_id?: string;
  notes?: string;

  // Legacy/mock fields (optional)
  patientInfo?: {
    id: string;
    name: string;
    age?: number;
    roomNumber: string;
  };
  origin?: {
    floor: number;
    zone: string;
    room: string;
  };
  destination?: {
    floor: number;
    zone: string;
    room: string;
  };
  equipmentType?: EquipmentType;
  requestedBy?: string; // Staff name
  requestedAt?: Date;
  assignedStaff?: string; // Staff ID
  assignedEquipment?: string; // Equipment ID
  estimatedDuration?: number; // minutes
}

// Optimal Placement Suggestion
export interface PlacementSuggestion {
  equipmentId: string;
  suggestedZone: string;
  suggestedLocation: { x: number; y: number; floor: number };
  reason: string;
  priority: number; // 1-10
}
