"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const { user, login } = useAuth();
    const router = useRouter();

    // Estados para login tradicional
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loadingLocal, setLoadingLocal] = useState(false);

    useEffect(() => {
        if (user) {
            router.push("/perfil");
        }
    }, [user, router]);

    // Manejar Login con Google
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/connect/google`;
    };

    // Manejar Login con Email/Pass
    const handleLocalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoadingLocal(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier, // Puede ser email o username
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error?.message === "Your account email is not confirmed") {
                    throw new Error("Por favor revisa tu correo y verifica tu cuenta antes de iniciar sesión.");
                }
                throw new Error("Email o contraseña incorrectos");
            }

            login(data.jwt, data.user);
            // La redirección la maneja el useEffect de arriba
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingLocal(false);
        }
    };

    return (
        // 👇 FONDO DE PANTALLA
        <div
            className="flex min-h-screen items-center justify-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            {/* Capa oscura (Overlay) para resaltar el formulario */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 relative z-10">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#2F4A2D]">¡Hola de nuevo!</h1>
                    <p className="mt-2 text-gray-500">Ingresa a tu cuenta para continuar</p>
                </div>

                {/* --- FORMULARIO EMAIL/PASS --- */}
                <form onSubmit={handleLocalLogin} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL O USUARIO</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2F4A2D]"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
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
                        />
                        <div className="flex justify-end mt-1">
                            <Link href="/recuperar-clave" className="text-xs text-[#2F4A2D] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loadingLocal}
                        className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-lg hover:bg-[#1e331c] transition-colors disabled:opacity-50"
                    >
                        {loadingLocal ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                {/* --- SEPARADOR --- */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">O continúa con</span>
                    </div>
                </div>

                {/* --- BOTÓN GOOGLE --- */}
                <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="h-5 w-5"
                    />
                    Google
                </button>

                {/* --- LINK A REGISTRO --- */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link href="/registrarse" className="text-[#2F4A2D] font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>

            </div>
        </div>
    );
}