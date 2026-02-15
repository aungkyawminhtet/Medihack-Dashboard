import { apiRequest } from "../axio";

export const getAllStaff = async (token?: string) => {
  try {
    const response = await apiRequest(token).get("/workload/staff");
    return response.data;
  } catch (error: any) {
    console.error("Get all staff error:", error);
    throw error;
  }
};

export const getStaffByRole = async (role: string, token?: string) => {
  try {
    const response = await apiRequest(token).get(
      `/workload/staff?role=${role}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get staff by role error:", error);
    throw error;
  }
};

export const getStaffByStatus = async (status: string, token?: string) => {
  try {
    const response = await apiRequest(token).get(
      `/workload/staff?status=${status}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get staff by status error:", error);
    throw error;
  }
};

export const getAvailablePorters = async (token?: string) => {
  try {
    const response = await apiRequest(token).get(
      "/workload/staff?role=porter&status=available",
    );
    return response.data;
  } catch (error: any) {
    console.error("Get available porters error:", error);
    throw error;
  }
};

export const getStaffById = async (staffId: string, token?: string) => {
  try {
    const response = await apiRequest(token).get(
      `/workload/staff/${staffId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get staff by ID error:", error);
    throw error;
  }
};
