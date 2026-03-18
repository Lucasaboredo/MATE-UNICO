"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegistrarsePage() {
    const { login } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/auth/local/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Manejo básico de errores de Strapi
                throw new Error(data.error?.message || "Error al registrarse");
            }

            // Si Strapi requiere verificación de email, no devuelve JWT
            if (!data.jwt) {
                setError("Registro exitoso. Por favor revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.");
            } else {
                login(data.jwt, data.user);
                router.push("/perfil");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 👇 FONDO DE PANTALLA (Igual que en Login)
        <div
            className="flex min-h-screen items-center justify-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            {/* Capa oscura (Overlay) */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 relative z-10">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#2F4A2D]">Crear Cuenta</h1>
                    <p className="mt-2 text-gray-500">Únete a la comunidad de Mate Único</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE DE USUARIO</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2F4A2D]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej: JuanMate"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2F4A2D]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="juan@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">CONTRASEÑA</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2F4A2D]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                        />
                        <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-lg hover:bg-[#1e331c] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-[#2F4A2D] font-bold hover:underline">
                        Inicia Sesión
                    </Link>
                </div>

            </div>
        </div>
    );
}