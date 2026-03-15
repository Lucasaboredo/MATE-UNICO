"use client";

import { useEffect, Suspense, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

function GoogleRedirectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        // Solo extraemos el access_token limpio, ignorando el resto de parámetros que ensucian la petición
        const accessToken = searchParams.get("access_token");

        if (accessToken) {
            hasFetched.current = true;

            // Le mandamos SOLO el access_token a Strapi
            fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"}/api/auth/google/callback?access_token=${accessToken}`)
                .then((res) => {
                    if (!res.ok) throw new Error("No se pudo autenticar con Google");
                    return res.json();
                })
                .then((data) => {
                    if (data.jwt && data.user) {
                        login(data.jwt, data.user);
                        router.push("/perfil");
                    } else {
                        throw new Error("Respuesta inválida de Strapi");
                    }
                })
                .catch((err) => {
                    console.error("Error en Google Auth:", err);
                    setErrorMsg("Hubo un error al iniciar sesión. Redirigiendo al login...");
                    setTimeout(() => router.push("/login"), 3000);
                });
        } else {
            router.push("/login");
        }
    }, [searchParams, router, login]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7F2] px-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2F4A2D] border-t-transparent mb-4"></div>
            <p className="text-lg font-bold text-[#2F4A2D]">
                {errorMsg ? errorMsg : "Validando cuenta de Google..."}
            </p>
        </div>
    );
}

export default function GoogleRedirectPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2]">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2F4A2D] border-t-transparent"></div>
                </div>
            }
        >
            <GoogleRedirectContent />
        </Suspense>
    );
}