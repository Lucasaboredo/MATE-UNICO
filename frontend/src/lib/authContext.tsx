"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { setToken, getToken, removeToken } from "./auth";

export interface User {
    id: number;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    
    // ✅ CORREGIDO: Quitamos el '?' para que sean obligatorios
    createdAt: string;
    updatedAt: string;

    // Identidad
    nombre?: string;
    apellido?: string;
    telefono?: string;

    // Facturación (Personal)
    direccion_facturacion?: string;
    numero_facturacion?: string;
    ciudad_facturacion?: string;
    provincia_facturacion?: string;
    cp_facturacion?: string;

    // Envío (Checkout)
    direccion?: string;
    numero?: string;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedToken = getToken();
            const storedUser = localStorage.getItem("strapi_user");

            if (storedToken && storedUser) {
                setTokenState(storedToken);
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        localStorage.setItem("strapi_user", JSON.stringify(userData));
        setTokenState(newToken);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem("strapi_user");
        setTokenState(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};