"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarClavePage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Si Strapi falla (ej: correo no registrado, u otro error)
                throw new Error(data.error?.message || "Error al solicitar la recuperación.");
            }

            setMessage("Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#2F4A2D]">Recuperar Clave</h1>
                    <p className="mt-2 text-gray-500">Ingresa tu email para resetear tu contraseña</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4 mb-6">
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

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center font-semibold">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-lg hover:bg-[#1e331c] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <Link href="/login" className="text-[#2F4A2D] font-bold hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
