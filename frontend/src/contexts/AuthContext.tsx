import { createContext, useContext, type ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import type { User } from "@/types/user";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ accessToken: string; user: User }>;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
