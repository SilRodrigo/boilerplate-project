import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
}
