"use client";

import React, { useState } from "react";
import Stepper from "@/components/stepper/Stepper";
import CartItemRow from "@/components/cart/CartItemRow";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { fetchFromStrapi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CarritoPage() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Estados para la validación de stock
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleContinuar = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. LÓGICA DE REBOTE DE STOCK (La que le gusta al profe)
      for (const item of items) {
        // Buscamos por slug con tu fetch original (Cache Buster incluido)
        const path = `/productos?filters[slug][$eq]=${item.slug}&populate=variantes`;
        const res = await fetchFromStrapi(path);
        
        const productoRaw = res?.data?.[0];
        if (!productoRaw) {
          throw new Error(`El producto "${item.nombre}" ya no está disponible.`);
        }

        const data = productoRaw.attributes || productoRaw;
        let stockReal = 0;

        if (item.variantId && data.variantes) {
          const variante = data.variantes.find((v: any) => v.id === item.variantId);
          stockReal = variante ? (variante.stock ?? 0) : 0;
        } else {
          stockReal = data.stock ?? 0;
        }

        if (stockReal < item.cantidad) {
          throw new Error(
            `¡Stock insuficiente! De "${item.nombre}" solo quedan ${stockReal} unidades.`
          );
        }
      }

      // 2. VERIFICACIÓN DE LOGIN (Tu lógica vieja)
      if (user) {
        router.push("/checkout");
      } else {
        router.push("/login?redirect=/checkout");
      }

    } catch (err: any) {
      setErrorMsg(err.message || "Error al verificar stock.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col">
      <Header />
      
      <div className="flex-grow max-w-[1100px] mx-auto px-6 py-16 w-full">
        {/* STEPPER ORIGINAL */}
        <Stepper currentStep={1} />

        {/* MENSAJE DE ERROR DE STOCK (Diseño limpio) */}
        {errorMsg && (
          <div className="mt-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl text-center font-medium animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* TITULO */}
        <h2 className="mt-12 mb-6 text-sm font-semibold text-[#333] uppercase tracking-wider">
          Productos seleccionados
        </h2>

        {/* LISTA DE PRODUCTOS */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <CartItemRow
              key={`${item.productId}-${item.variantId}-${item.textoGrabado || 'none'}-${index}`}
              item={item}
            />
          ))}

          {items.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 mb-6">Tu carrito está vacío</p>
              <button 
                onClick={() => router.push("/productos")}
                className="text-[#6B7A63] font-bold underline"
              >
                Ir a la tienda
              </button>
            </div>
          )}
        </div>

        {/* FOOTER DEL CARRITO (Diseño recuperado) */}
        {items.length > 0 && (
          <div className="mt-16 space-y-10">
            {/* TOTAL ESTILO MATE UNICO */}
            <div className="flex justify-end">
              <div className="flex items-center gap-6 bg-[#C9C1B5] px-8 py-3 rounded-full shadow-sm">
                <span className="text-sm uppercase font-medium text-[#4A443C]">Total</span>
                <span className="font-bold text-lg text-[#2D2A26]">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            {/* BOTÓN CONTINUAR CON SPINNER */}
            <div className="flex justify-center">
              <button
                onClick={handleContinuar}
                disabled={loading}
                className={`
                  bg-[#6B7A63] text-white px-20 py-4 rounded-full font-medium shadow-lg
                  transition-all active:scale-95
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5a6652]"}
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando...
                  </div>
                ) : (
                  "Continuar"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}