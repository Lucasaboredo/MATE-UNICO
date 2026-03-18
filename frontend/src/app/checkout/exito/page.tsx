"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCart } from "@/lib/cartContext";

function SuccessContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    // Solo vaciamos el carrito una vez al montar la página de éxito
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. Número de Orden (Tu referencia interna)
  const orderNumber =
    params.get("external_reference") ||
    params.get("merchant_order_id") ||
    params.get("order_id") ||
    "N/A";

  // 2. CORRECCIÓN: Usamos el ID de Pago de Mercado Pago (collection_id)
  // Este dato SÍ llega en la URL y es útil para reclamos.
  const paymentId =
    params.get("collection_id") ||
    params.get("payment_id") ||
    "N/A";

  const amount = params.get("amount") || params.get("total") || null;

  return (
    <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
      <div className="px-8 py-12 md:px-12 md:py-16 text-center">
        
        {/* Encabezado e Icono */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Tu pedido ha sido procesado correctamente. Te hemos enviado un email con los detalles.
        </p>

        {/* Imagen (Optimizada) */}
        <div className="relative w-full h-auto max-w-[500px] mx-auto mb-10 transform hover:scale-105 transition-transform duration-500">
          <img
            src="/checkout/pago-exitoso.svg"
            alt="Pago exitoso ilustración"
            className="w-full h-auto drop-shadow-md"
          />
        </div>

        {/* Tarjeta de Resumen (Tipo Ticket) */}
        <div className="bg-[#F9F7F2] rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-[#EBE5D9]">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Resumen de la operación
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* Bloque Orden */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Nº de Orden</span>
              <span className="text-lg font-bold text-[#1a1a1a] break-all">#{orderNumber}</span>
            </div>

            {/* Bloque ID Pago (CORREGIDO) */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">ID Operación MP</span>
              <span className="text-base font-medium text-[#1a1a1a] break-all">{paymentId}</span>
            </div>

            {/* Bloque Total */}
            {amount && (
              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-gray-500 mb-1">Total Pagado</span>
                <span className="text-xl font-bold text-green-700">
                  ${Number(amount).toLocaleString("es-AR")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white transition-all duration-200 bg-[#1a1a1a] rounded-full hover:bg-[#333] hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Volver a la tienda
          </Link>
          <p className="mt-6 text-sm text-gray-400">
            ¿Tienes dudas? <Link href="/contacto" className="underline hover:text-gray-600">Contáctanos</Link>
          </p>
        </div>

      </div>
      
      {/* Decoración inferior */}
      <div className="h-3 w-full bg-gradient-to-r from-[#4A4A40] via-[#5F6B58] to-[#4A4A40]" />
    </div>
  );
}

export default function CheckoutExitoPage() {
  return (
    <div className="min-h-screen bg-[#F2EEE8] flex items-center justify-center px-4 py-12 md:py-20">
      <Suspense fallback={<div className="text-center p-10">Cargando detalles...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}