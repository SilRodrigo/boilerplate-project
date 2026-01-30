import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export function useApi() {
  const { getAuthHeader } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${API_BASE_URL}${url}`;

    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na requisição API');
    }

    return response.json();
  };
}
