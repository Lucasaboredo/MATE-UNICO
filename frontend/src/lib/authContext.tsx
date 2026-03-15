"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";

interface AuthContextType {
  user: any;
  token: string | null; // ✅ 1. Agregamos el token a la interfaz
  loading: boolean;
  login: (jwt: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null); // ✅ 2. Creamos el estado para el token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const profile = await getProfile();
      const storedToken = localStorage.getItem("jwt"); // ✅ 3. Recuperamos el token al cargar

      setUser(profile);
      setToken(storedToken);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (jwt: string, userData: any) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt); // ✅ 4. Guardamos el token en el estado al hacer login
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null); // ✅ 5. Limpiamos el token al salir
    setUser(null);
    window.location.href = "/login";
  };

  return (
    // ✅ 6. Exportamos el token en el Provider
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}