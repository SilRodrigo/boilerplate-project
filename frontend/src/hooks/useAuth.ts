import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";
import type { User } from "@/types/user";

interface AuthResponse {
  data: {
    accessToken: string;
    user: User;
  };
}

const TOKEN_KEY = "authToken";
const USER_KEY = "user";

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore the saved session, then confirm the token is still valid with the backend
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (!savedToken || !savedUser) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    setUser(JSON.parse(savedUser));
    setIsLoading(false);

    fetch(`${API_BASE_URL}/user/me`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(async (response) => {
        if (response.status === 401) {
          clearSession();
          setToken(null);
          setUser(null);
          return;
        }

        if (response.ok) {
          const { data } = await response.json();
          localStorage.setItem(USER_KEY, JSON.stringify(data));
          setUser(data);
        }
      })
      .catch(() => { /* offline: keep the saved session */ });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/auth`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Falha ao fazer login");
      }

      const { data }: AuthResponse = await response.json();

      localStorage.setItem(TOKEN_KEY, data.accessToken);
      setToken(data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const getAuthHeader = useCallback((): Record<string, string> => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  return {
    token,
    user,
    isLoading,
    error,
    login,
    logout,
    getAuthHeader,
    isAuthenticated: !!token,
  };
}
