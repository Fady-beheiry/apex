import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetAdminMe, AdminUser, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";

interface AuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isLoading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [, setLocation] = useLocation();

  const { data: meData, isLoading } = useGetAdminMe({
    query: {
      queryKey: getGetAdminMeQueryKey(),
      enabled: !!token,
      retry: false,
    },
    request: {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  });

  useEffect(() => {
    if (meData) {
      setAdmin(meData);
    }
  }, [meData]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
      setAdmin(null);
    }
  }, [token]);

  const login = (newToken: string, newAdmin: AdminUser) => {
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setLocation("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ token, admin, isLoading, login, logout }}>
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
