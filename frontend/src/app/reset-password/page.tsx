"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!code) {
            setError("No se ha proporcionado un código válido.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    password,
                    passwordConfirmation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Error al restablecer la contraseña.");
            }

            setMessage("¡Tu contraseña ha sido restablecida con éxito!");
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleResetPassword} className="space-y-4 mb-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">NUEVA CONTRASEÑA</label>
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
            
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">CONFIRMAR CONTRASEÑA</label>
                <input
                    type="password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2F4A2D]"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    minLength={6}
                />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center font-semibold">{message}</p>}

            <button
                type="submit"
                disabled={loading || !code}
                className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-lg hover:bg-[#1e331c] transition-colors disabled:opacity-50"
            >
                {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div
            className="flex min-h-screen items-center justify-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#2F4A2D]">Nueva Contraseña</h1>
                    <p className="mt-2 text-gray-500">Ingresa tu nueva clave de acceso</p>
                </div>

                <Suspense fallback={<p className="text-center text-gray-500">Cargando...</p>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <Link href="/login" className="text-[#2F4A2D] font-bold hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
