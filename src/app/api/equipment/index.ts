import { apiRequest } from "../axio";

/**
 * Get all available equipment
 */
export const getAvailableEquipment = async (token?: string) => {
  const api = apiRequest(token || "");
  const response = await api.get("/equipment", {
    params: { status: "available" },
  });
  return response.data;
};

/**
 * Get nearby equipment based on location
 */
export const getNearbyEquipment = async (token?: string) => {
  const api = apiRequest(token || "");
  const response = await api.get("/equipment/nearby");
  return response.data;
};

/**
 * Search equipment by query
 */
export const searchEquipment = async (query: string, token?: string) => {
  const api = apiRequest(token || "");
  const response = await api.get("/equipment/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Get equipment by ID
 */
export const getEquipmentById = async (equipmentId: string, token?: string) => {
  const api = apiRequest(token || "");
  const response = await api.get(`/equipment/${equipmentId}`);
  return response.data;
};

/**
 * Get all equipment (no filters)
 */
export const getAllEquipment = async (token?: string) => {
  const api = apiRequest(token || "");
  const response = await api.get("/equipment");
  return response.data;
};

/**
 * Create new equipment
 */
interface CreateEquipmentPayload {
  type: string;
  current_location: string;
  status: string;
}

export const createEquipment = async (
  data: CreateEquipmentPayload,
  token?: string,
) => {
  const api = apiRequest(token || "");
  const response = await api.post("/equipment", data);
  return response.data;
};

/**
 * Update equipment status
 */
export const updateEquipmentStatus = async (
  equipmentId: string,
  status: string,
  token?: string,
) => {
  const api = apiRequest(token || "");
  const response = await api.put(`/equipment/${equipmentId}/status`, {
    status,
  });
  return response.data;
};
