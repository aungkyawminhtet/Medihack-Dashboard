import { apiRequest } from "../axio";
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const login = async (credentials: LoginPayload, token?: string) => {
  try {
    const response = await apiRequest(token).post<AuthResponse>(
      "/api/v1/users/login",
      credentials,
    );
    // console.log("Login successful:", response.data);

    return response.data;

  } catch (error: any) {
    console.error("Login API error:", error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.message) {
      throw error;
    }

    throw new Error("Login failed. Please try again.");
  }
};

export const register = async (userData: RegisterPayload, token?: string) => {
  try {
    const response = await apiRequest(token).post<AuthResponse>(
      "/api/v1/users/register",
      userData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
