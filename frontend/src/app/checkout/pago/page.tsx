"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper/Stepper";
import { useCart } from "@/lib/cartContext";
import { useCheckout } from "@/lib/checkoutContext";
import { fetchFromStrapi } from "@/lib/api";
import { useAuth } from "@/lib/authContext";

/* ================= STRAPI HOST ================= */
const STRAPI_HOST =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${STRAPI_HOST}${url}`;
  return `${STRAPI_HOST}/${url}`;
}

/* ================= IMAGEN SEGURA ================= */
function getImageFromCartItem(item: any): string {
  const direct =
    item?.imagenUrl ||
    item?.imageUrl ||
    item?.thumbnail ||
    item?.img ||
    item?.imagen;

  if (typeof direct === "string" && direct) return toAbsoluteUrl(direct);

  const strapiSingle =
    item?.imagen?.data?.attributes?.url ||
    item?.image?.data?.attributes?.url;
  if (strapiSingle) return toAbsoluteUrl(strapiSingle);

  const strapiMulti =
    item?.imagen?.data?.[0]?.attributes?.url ||
    item?.images?.data?.[0]?.attributes?.url;
  if (strapiMulti) return toAbsoluteUrl(strapiMulti);

  return "/placeholder-mate.png";
}

export default function CheckoutPagoPage() {
  const router = useRouter();

  const { items, clearCart } = useCart();
  const { buyer, shipping } = useCheckout();
  const { user } = useAuth(); 

  /* ================= ENVÍO ================= */
  const [envioPrecio, setEnvioPrecio] = useState(0);
  const [envioDemora, setEnvioDemora] = useState<string | null>(null);

  /* ================= CUPÓN ================= */
  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState<string | null>(null);
  const [aplicandoCupon, setAplicandoCupon] = useState(false);
  
  const cuponAplicado = descuento > 0;

  /* ================= UI ================= */
  const [msg, setMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ================= VALIDACIONES ================= */
  useEffect(() => {
    if (!buyer?.email) router.push("/checkout/datos");
    else if (!shipping?.codigoPostal) router.push("/checkout/envio");
    else if (!items || items.length === 0) router.push("/carrito");
  }, [buyer, shipping, items, router]);

  /* ================= CALCULAR ENVÍO ================= */
  useEffect(() => {
    async function calcularEnvio() {
      if (!shipping?.codigoPostal) return;

      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cp: shipping.codigoPostal }),
      });

      const data = await res.json();
      setEnvioPrecio(Number(data.price ?? 0));
      setEnvioDemora(data.delay ?? null);
    }

    calcularEnvio();
  }, [shipping?.codigoPostal]);

  /* ================= SUBTOTAL ================= */
  const subtotal = useMemo(() => {
    return (items || []).reduce((acc: number, item: any) => {
      return (
        acc +
        Number(item.precioUnitario ?? 0) *
        Number(item.cantidad ?? 1)
      );
    }, 0);
  }, [items]);

  /* ================= TOTALES Y FACTOR ================= */
  // AHORA: El descuento solo aplica al subtotal de productos
  const totalConDescuentoProductos = Math.max(subtotal - descuento, 0);
  
  // TOTAL FINAL = (Productos con descuento) + Envío (Entero)
  const totalPagar = totalConDescuentoProductos + envioPrecio;

  // Factor de descuento SOLO para items (envío queda fuera)
  const factor = descuento > 0 && subtotal > 0 ? descuento / subtotal : 0;

  /* ================= APLICAR CUPÓN ================= */
  async function aplicarCupon() {
    if (!codigoCupon) return;

    setAplicandoCupon(true);
    setCuponMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cupones/validar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codigo: codigoCupon,
            total: subtotal, // CAMBIO: Enviamos solo el subtotal para validar
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error();

      // Aseguramos que el descuento no sea mayor que el subtotal
      const descuentoReal = Math.min(Number(data.descuento) || 0, subtotal);
      
      setDescuento(descuentoReal);
      setCuponMsg("Cupón aplicado correctamente");
    } catch {
      setDescuento(0);
      setCuponMsg("Cupón inválido");
    } finally {
      setAplicandoCupon(false);
    }
  }

  /* ================= CONFIRMAR PAGO ================= */
  async function handleConfirm() {
    setIsProcessing(true);
    setMsg(null);

    try {
      // 1️⃣ Crear orden en Strapi
      const orden = await fetchFromStrapi("/ordens", {
        method: "POST",
        body: JSON.stringify({
          data: {
            buyer,
            shipping: {
              ...shipping,
              costoEnvio: envioPrecio,
            },
            items,
            total: totalPagar,
            cliente: user?.id || null, 
          },
        }),
      });

      const orderId = orden.data.id;

      // 2️⃣ Items Mercado Pago (con descuento aplicado)
      const mpItems: any[] = items.map((item: any) => ({
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: Number(item.precioUnitario) * (1 - factor),
      }));

      // CAMBIO: El envío se agrega SIN FACTOR DE DESCUENTO
      if (envioPrecio > 0) {
        mpItems.push({
          title: "Costo de Envío",
          quantity: 1,
          unit_price: envioPrecio, // Precio Full
        });
      }

      // 3️⃣ Crear Preferencia
      const mpRes = await fetch("/api/pago/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, items: mpItems }),
      });

      const mpData = await mpRes.json();
      if (!mpData.init_point) throw new Error();

      clearCart();
      window.location.href = mpData.init_point;
    } catch (err) {
      console.error(err);
      setMsg("Hubo un error al iniciar el pago");
      setIsProcessing(false);
    }
  }

  if (!items || items.length === 0) return null;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Stepper currentStep={4} />

        {/* LISTA DE ITEMS */}
        <div className="mt-12 space-y-3">
          
          {/* 1. PRODUCTOS (Con descuento si aplica) */}
          {items.map((item: any) => {
            const precioOriginal = item.precioUnitario * item.cantidad;
            const precioConDescuento = precioOriginal * (1 - factor);

            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-center justify-between rounded-2xl bg-[#6B5E54] px-6 py-5 text-white transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getImageFromCartItem(item)}
                    alt={item.nombre}
                    className="h-16 w-16 rounded-xl object-cover bg-white/10"
                  />
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-xs opacity-80">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end justify-center">
                  {cuponAplicado ? (
                    // ✨ PRECIO TACHADO + NUEVO
                    <div className="animate-in slide-in-from-right-2 duration-500">
                      <span className="text-xs text-gray-300 line-through block mb-0.5">
                        ${precioOriginal.toLocaleString("es-AR")}
                      </span>
                      <span className="text-lg font-bold text-[#86EFAC]">
                        ${precioConDescuento.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ) : (
                    // PRECIO NORMAL
                    <span className="text-sm font-medium">
                      ${precioOriginal.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* 2. TARJETA DE ENVÍO (Siempre precio full) */}
          {envioPrecio > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-[#EBE7E0] border border-[#D6CEC5] px-6 py-4 text-[#5C5149]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  🚚
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">Costo de Envío</p>
                  <p className="text-xs text-gray-500">
                    {envioDemora ? `Llega en ${envioDemora}` : "Envío a domicilio"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                 {/* El envío siempre se muestra normal, sin tachar */}
                 <span className="text-sm font-bold">
                    ${envioPrecio.toLocaleString("es-AR")}
                 </span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT CUPÓN */}
        <div className="mt-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <input
              value={codigoCupon}
              disabled={cuponAplicado || aplicandoCupon}
              onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DE CUPÓN"
              className="rounded-full bg-[#E5DED6] px-5 py-2 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-[#6B5E54] placeholder-gray-500"
            />

            {cuponAplicado ? (
              <span className="rounded-full bg-[#4F7A55] px-4 py-2 text-xs text-white shadow-sm animate-in zoom-in">
                APLICADO
              </span>
            ) : (
              <button
                onClick={aplicarCupon}
                disabled={aplicandoCupon}
                className="rounded-full bg-[#6B5E54] px-5 py-2 text-xs text-white hover:bg-[#5a4e46] transition-colors shadow-sm"
              >
                {aplicandoCupon ? "..." : "Aplicar"}
              </button>
            )}
          </div>

          {cuponMsg && (
            <span
              className={`text-xs font-medium ml-1 ${
                cuponAplicado ? "text-green-700" : "text-red-600"
              }`}
            >
              {cuponMsg}
            </span>
          )}
        </div>

        {/* TOTAL FINAL */}
        <div className="mt-12 flex justify-end">
          <div className="rounded-full bg-[#6B5E54] px-10 py-4 text-white font-bold text-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            Total: ${totalPagar.toLocaleString("es-AR")}
          </div>
        </div>

        {/* BOTÓN MERCADO PAGO */}
        <div className="mt-10 flex justify-center pb-10">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex items-center gap-3 rounded-full bg-[#009EE3] px-8 py-4 text-white font-bold hover:bg-[#008AC5] transition-all transform hover:scale-105 shadow-xl disabled:opacity-70 disabled:scale-100"
          >
            <img src="/mercadopago.svg" alt="Mercado Pago" className="h-8 w-auto" />
            {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
          </button>
        </div>

        {msg && (
          <p className="text-center text-sm font-bold text-red-600 mb-6">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}