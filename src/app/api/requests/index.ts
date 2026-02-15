import { apiRequest } from "../axio";

interface CreateRequestPayload {
  patient_name: string;
  priority: number;
  pickup_room_id: string;
  destination_room_id: string;
  equipment_type: string;
  notes?: string;
}

interface AssignRequestPayload {
  porter_id: string;
  equipment_id: string;
}

interface UpdateStatusPayload {
  status: string;
}

export const getAllRequests = async (token?: string) => {
  try {
    const response = await apiRequest(token).get("/requests");
    return response.data;
  } catch (error: any) {
    console.error("Get requests error:", error);
    throw error;
  }
};

export const getActiveRequests = async (token?: string) => {
  try {
    const response = await apiRequest(token).get("/requests/active");
    return response.data;
  } catch (error: any) {
    console.error("Get active requests error:", error);
    throw error;
  }
};

export const getMyRequests = async (token?: string) => {
  try {
    const response = await apiRequest(token).get("/requests/my-requests");
    return response.data;
  } catch (error: any) {
    console.error("Get my requests error:", error);
    throw error;
  }
};

export const getAssignedRequests = async (token?: string) => {
  try {
    const response = await apiRequest(token).get("/requests/assigned");
    return response.data;
  } catch (error: any) {
    console.error("Get assigned requests error:", error);
    throw error;
  }
};

export const getRequestById = async (requestId: string, token?: string) => {
  try {
    const response = await apiRequest(token).get(`/requests/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error("Get request by ID error:", error);
    throw error;
  }
};

export const createRequest = async (
  payload: CreateRequestPayload,
  token?: string,
) => {
  try {
    const response = await apiRequest(token).post("/requests", payload);
    return response.data;
  } catch (error: any) {
    console.error("Create request error:", error);
    throw error;
  }
};

export const updateRequestStatus = async (
  requestId: string,
  payload: UpdateStatusPayload,
  token?: string,
) => {
  try {
    const response = await apiRequest(token).put(
      `/requests/${requestId}/status`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error("Update request status error:", error);
    throw error;
  }
};

export const assignRequest = async (
  requestId: string,
  payload: AssignRequestPayload,
  token?: string,
) => {
  try {
    const response = await apiRequest(token).put(
      `/requests/${requestId}/assign`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error("Assign request error:", error);
    throw error;
  }
};

export const cancelRequest = async (requestId: string, token?: string) => {
  try {
    const response = await apiRequest(token).delete(
      `/requests/${requestId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Cancel request error:", error);
    throw error;
  }
};

export const getRequestsByStatus = async (status: string, token?: string) => {
  try {
    const response = await apiRequest(token).get(
      `/requests?status=${status}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get requests by status error:", error);
    throw error;
  }
};

export const getRequestsByPriority = async (
  priority: number,
  token?: string,
) => {
  try {
    const response = await apiRequest(token).get(
      `/requests?priority=${priority}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get requests by priority error:", error);
    throw error;
  }
};

export const getRequestsByEquipmentType = async (
  equipmentType: string,
  token?: string,
) => {
  try {
    const response = await apiRequest(token).get(
      `/requests?equipment_type=${equipmentType}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get requests by equipment type error:", error);
    throw error;
  }
};
