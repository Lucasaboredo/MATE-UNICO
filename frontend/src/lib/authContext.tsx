"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (jwt: string, user: any) => void; // Cambiado para aceptar los datos directamente
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const profile = await getProfile();
      setUser(profile);
      setLoading(false);
    };
    initAuth();
  }, []);

  // Esta función ahora recibe lo que tu página de Login/Register ya le está enviando
  const login = (jwt: string, userData: any) => {
    localStorage.setItem("jwt", jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}