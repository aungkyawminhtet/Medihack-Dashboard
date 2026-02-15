import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  TransportEquipment,
  StaffMember,
  TransportRequest,
} from "../types/transport";
import { AccessPoint } from "../types/access-point";
import { FloorConfig } from "../types/floor-config";
import {
  equipmentData,
  staffData,
  transportRequestsData,
  accessPointsData,
  DEFAULT_FLOOR_CONFIG,
} from "../api";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "manager";
}

interface AppContextType {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  equipment: TransportEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<TransportEquipment[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  requests: TransportRequest[];
  setRequests: React.Dispatch<React.SetStateAction<TransportRequest[]>>;
  accessPoints: AccessPoint[];
  setAccessPoints: React.Dispatch<React.SetStateAction<AccessPoint[]>>;
  floorConfig: FloorConfig[];
  setFloorConfig: React.Dispatch<React.SetStateAction<FloorConfig[]>>;
  selectedFloor: number;
  setSelectedFloor: React.Dispatch<React.SetStateAction<number>>;
  selectedEquipment: TransportEquipment | null;
  setSelectedEquipment: React.Dispatch<
    React.SetStateAction<TransportEquipment | null>
  >;
  selectedStaff: StaffMember | null;
  setSelectedStaff: React.Dispatch<React.SetStateAction<StaffMember | null>>;
  selectedAccessPoint: AccessPoint | null;
  setSelectedAccessPoint: React.Dispatch<
    React.SetStateAction<AccessPoint | null>
  >;
  handleAssignRequest: (
    requestId: string,
    staffId: string,
    equipmentId: string,
  ) => void;
  handleCancelRequest: (requestId: string) => void;
  handleNewRequest: (requestData: Partial<TransportRequest>) => void;
  handleAddEquipment: (equipmentData: Partial<TransportEquipment>) => void;
  handleUpdateEquipment: (
    equipmentId: string,
    updates: Partial<TransportEquipment>,
  ) => void;
  handleDeleteEquipment: (equipmentId: string) => void;
  handleAssignEquipmentLocation: (
    equipmentId: string,
    floor: number,
    zone: string,
  ) => void;
  handleAddStaff: (staffData: Partial<StaffMember>) => void;
  handleUpdateStaff: (staffId: string, updates: Partial<StaffMember>) => void;
  handleDeleteStaff: (staffId: string) => void;
  handleAddAccessPoint: (accessPointData: Partial<AccessPoint>) => void;
  handleFloorConfigUpdate: (newConfig: FloorConfig[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [user, setUser] = useState<User | null>(null);

  const [equipment, setEquipment] =
    useState<TransportEquipment[]>(equipmentData);
  const [staff, setStaff] = useState<StaffMember[]>(staffData);
  const [requests, setRequests] = useState<TransportRequest[]>(
    transportRequestsData,
  );
  const [accessPoints, setAccessPoints] =
    useState<AccessPoint[]>(accessPointsData);
  const [floorConfig, setFloorConfig] =
    useState<FloorConfig[]>(DEFAULT_FLOOR_CONFIG);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedEquipment, setSelectedEquipment] =
    useState<TransportEquipment | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedAccessPoint, setSelectedAccessPoint] =
    useState<AccessPoint | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment((prevEquipment) =>
        prevEquipment.map((eq) => {
          if (eq.status === "in-use" || eq.status === "requested") {
            return {
              ...eq,
              location: {
                ...eq.location,
                x: Math.max(
                  50,
                  Math.min(850, eq.location.x + (Math.random() - 0.5) * 20),
                ),
                y: Math.max(
                  50,
                  Math.min(550, eq.location.y + (Math.random() - 0.5) * 20),
                ),
              },
            };
          }
          return eq;
        }),
      );

      // Simulate staff movement
      setStaff((prevStaff) =>
        prevStaff.map((s) => ({
          ...s,
          location: {
            ...s.location,
            x: Math.max(
              50,
              Math.min(850, s.location.x + (Math.random() - 0.5) * 15),
            ),
            y: Math.max(
              50,
              Math.min(550, s.location.y + (Math.random() - 0.5) * 15),
            ),
          },
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getZoneCenter = (floor: number, zoneName: string) => {
    const floorData = floorConfig.find((f) => f.number === floor);
    const zone = floorData?.zones.find((z) => z.name === zoneName);
    if (!zone?.bounds) return null;

    return {
      x: zone.bounds.x + zone.bounds.width / 2,
      y: zone.bounds.y + zone.bounds.height / 2,
    };
  };

  const handleAssignRequest = (
    requestId: string,
    staffId: string,
    equipmentId: string,
  ) => {
    const request = requests.find((r) => r.id === requestId);
    const selectedStaff = staff.find((s) => s.id === staffId);
    const selectedEquipment = equipment.find((eq) => eq.id === equipmentId);

    if (!request || !selectedStaff || !selectedEquipment) {
      toast.error("Invalid assignment: request, staff, or equipment not found");
      return;
    }

    if (selectedStaff.status !== "available") {
      toast.error("Selected staff is not available");
      return;
    }

    if (selectedEquipment.status !== "available") {
      toast.error("Selected equipment is not available");
      return;
    }

    if (
      selectedEquipment.type !==
      (request.equipmentType || request.equipment_type)
    ) {
      toast.error("Selected equipment type does not match request");
      return;
    }

    const originCenter = getZoneCenter(
      request.origin?.floor || 1,
      request.origin?.zone || "",
    );

    setRequests((prevRequests) =>
      prevRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "assigned" as const,
              assignedStaff: staffId,
              assignedEquipment: equipmentId,
            }
          : r,
      ),
    );

    setStaff((prevStaff) =>
      prevStaff.map((s) =>
        s.id === staffId
          ? {
              ...s,
              status: "busy" as const,
              currentWorkload: s.currentWorkload + 1,
              assignedEquipment: [...(s.assignedEquipment || []), equipmentId],
              location: {
                ...s.location,
                floor: request.origin?.floor || s.location.floor,
                zone: request.origin?.zone || s.location.zone,
                x: originCenter?.x ?? s.location.x,
                y: originCenter?.y ?? s.location.y,
              },
            }
          : s,
      ),
    );

    setEquipment((prevEquipment) =>
      prevEquipment.map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              status: "in-use" as const,
              assignedStaff: staffId,
              currentRequest: requestId,
              location: {
                ...eq.location,
                floor: request.origin?.floor || eq.location.floor,
                zone: request.origin?.zone || eq.location.zone,
                x: originCenter?.x ?? eq.location.x,
                y: originCenter?.y ?? eq.location.y,
              },
            }
          : eq,
      ),
    );

    toast.success(`Request assigned to ${selectedStaff.name}`);
  };

  const handleCancelRequest = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((r) =>
        r.id === requestId ? { ...r, status: "cancelled" as const } : r,
      ),
    );
    toast.info("Request cancelled");
  };

  const handleNewRequest = (requestData: Partial<TransportRequest>) => {
    const newRequest: TransportRequest = {
      id: `REQ-${Date.now()}`,
      ...requestData,
    } as TransportRequest;

    setRequests((prevRequests) => [...prevRequests, newRequest]);
    toast.success("New transport request created");
  };

  const handleAddEquipment = (equipmentData: Partial<TransportEquipment>) => {
    const newEquipment: TransportEquipment = {
      id: `EQ-${Date.now()}`,
      ...equipmentData,
    } as TransportEquipment;

    setEquipment((prevEquipment) => [...prevEquipment, newEquipment]);
    toast.success("New equipment added");
  };

  const handleUpdateEquipment = (
    equipmentId: string,
    updates: Partial<TransportEquipment>,
  ) => {
    setEquipment((prevEquipment) =>
      prevEquipment.map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              ...updates,
              location: updates.location
                ? { ...eq.location, ...updates.location }
                : eq.location,
            }
          : eq,
      ),
    );
    toast.success("Equipment updated");
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment((prevEquipment) =>
      prevEquipment.filter((eq) => eq.id !== equipmentId),
    );
    toast.success("Equipment deleted");
  };

  const handleAssignEquipmentLocation = (
    equipmentId: string,
    floor: number,
    zone: string,
  ) => {
    const zoneCenter = getZoneCenter(floor, zone);
    setEquipment((prevEquipment) =>
      prevEquipment.map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              location: {
                ...eq.location,
                floor,
                zone,
                x: zoneCenter?.x ?? eq.location.x,
                y: zoneCenter?.y ?? eq.location.y,
              },
            }
          : eq,
      ),
    );
    toast.success("Equipment location assigned");
  };

  const handleAddStaff = (staffData: Partial<StaffMember>) => {
    const newStaff: StaffMember = {
      id: `STAFF-${Date.now()}`,
      name: staffData.name || "New Staff",
      role: staffData.role || "Patient Transport",
      status: staffData.status || "available",
      location: staffData.location || {
        x: 200,
        y: 200,
        floor: 1,
        zone: "Emergency",
      },
      currentWorkload: staffData.currentWorkload ?? 0,
      completedToday: staffData.completedToday ?? 0,
      assignedEquipment: staffData.assignedEquipment,
    };

    setStaff((prevStaff) => [...prevStaff, newStaff]);
    toast.success("New staff added");
  };

  const handleUpdateStaff = (
    staffId: string,
    updates: Partial<StaffMember>,
  ) => {
    setStaff((prevStaff) =>
      prevStaff.map((member) =>
        member.id === staffId
          ? {
              ...member,
              ...updates,
              location: updates.location
                ? { ...member.location, ...updates.location }
                : member.location,
            }
          : member,
      ),
    );
    toast.success("Staff updated");
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff((prevStaff) =>
      prevStaff.filter((member) => member.id !== staffId),
    );
    toast.success("Staff deleted");
  };

  const handleAddAccessPoint = (accessPointData: Partial<AccessPoint>) => {
    const newAccessPoint: AccessPoint = {
      id: `AP-${Date.now()}`,
      ...accessPointData,
    } as AccessPoint;

    setAccessPoints((prevAccessPoints) => [
      ...prevAccessPoints,
      newAccessPoint,
    ]);
    toast.success("New access point added");
  };

  const handleFloorConfigUpdate = (newConfig: FloorConfig[]) => {
    setFloorConfig(newConfig);
    toast.success("Floor configuration updated");
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: user !== null && localStorage.getItem("token") !== null,
        login,
        logout,
        equipment,
        setEquipment,
        staff,
        setStaff,
        requests,
        setRequests,
        accessPoints,
        setAccessPoints,
        floorConfig,
        setFloorConfig,
        selectedFloor,
        setSelectedFloor,
        selectedEquipment,
        setSelectedEquipment,
        selectedStaff,
        setSelectedStaff,
        selectedAccessPoint,
        setSelectedAccessPoint,
        handleAssignRequest,
        handleCancelRequest,
        handleNewRequest,
        handleAddEquipment,
        handleUpdateEquipment,
        handleDeleteEquipment,
        handleAssignEquipmentLocation,
        handleAddStaff,
        handleUpdateStaff,
        handleDeleteStaff,
        handleAddAccessPoint,
        handleFloorConfigUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useAppContext() {
  return useApp();
}
