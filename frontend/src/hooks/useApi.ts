import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";

export function useApi() {
  const { getAuthHeader, logout } = useAuth();

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
      // Expired or invalid token: drop the session so PrivateRoute sends the user to /login
      if (response.status === 401) logout();

      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro na requisição API');
    }

    return response.json();
  };
}
