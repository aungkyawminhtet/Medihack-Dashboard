/// <reference types="vite/client" />
import axios from "axios";

export const apiRequest = (token?: string | null | undefined) => {
    
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BASE_API,
    headers,
  });
};
