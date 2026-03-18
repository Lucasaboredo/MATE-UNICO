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
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${STRAPI_HOST}${url}`;
  return `${STRAPI_HOST}/${url}`;
}

/* ================= IMAGEN SEGURA ================= */
function getImageFromCartItem(item: any): string {
  const direct = item?.imagenUrl || item?.imageUrl || item?.thumbnail || item?.img || item?.imagen;
  if (typeof direct === "string" && direct) return toAbsoluteUrl(direct);
  const strapiSingle = item?.imagen?.data?.attributes?.url || item?.image?.data?.attributes?.url;
  if (strapiSingle) return toAbsoluteUrl(strapiSingle);
  const strapiMulti = item?.imagen?.data?.[0]?.attributes?.url || item?.images?.data?.[0]?.attributes?.url;
  if (strapiMulti) return toAbsoluteUrl(strapiMulti);
  return "/placeholder-mate.png";
}

export default function CheckoutPagoPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { buyer, shipping } = useCheckout();
  const { user } = useAuth();

  const [envioPrecio, setEnvioPrecio] = useState(0);
  const [envioDemora, setEnvioDemora] = useState<string | null>(null);
  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState<string | null>(null);
  const [aplicandoCupon, setAplicandoCupon] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cuponAplicado = descuento > 0;

  useEffect(() => {
    if (!buyer?.email) router.push("/checkout/datos");
    else if (!items || items.length === 0) router.push("/carrito");
  }, [buyer, items, router]);

  useEffect(() => {
    async function calcularEnvio() {
      if (!shipping?.codigoPostal) return;
      try {
        const res = await fetch("/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cp: shipping.codigoPostal }),
        });
        const data = await res.json();
        setEnvioPrecio(Number(data.price ?? 0));
        setEnvioDemora(data.delay ?? null);
      } catch (e) { console.error(e); }
    }
    calcularEnvio();
  }, [shipping?.codigoPostal]);

  const subtotal = useMemo(() => {
    return (items || []).reduce((acc: number, item: any) => acc + Number(item.precioUnitario ?? 0) * Number(item.cantidad ?? 1), 0);
  }, [items]);

  const totalConDescuentoProductos = Math.max(subtotal - descuento, 0);
  const totalPagar = totalConDescuentoProductos + envioPrecio;
  const precioOriginalTotal = subtotal + envioPrecio;

  const factor = descuento > 0 && subtotal > 0 ? descuento / subtotal : 0;

  async function aplicarCupon() {
    if (!codigoCupon) return;
    setAplicandoCupon(true);
    setMsg(null);
    try {
      const res = await fetch(`${STRAPI_HOST}/api/cupones/validar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: codigoCupon,
          total: subtotal,
          clienteId: user?.id
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || data?.message || "Cupón inválido");
      }

      setDescuento(Math.min(Number(data.descuento) || 0, subtotal));
      setCuponMsg(data.message || "Cupón aplicado correctamente");
    } catch (err: any) {
      setDescuento(0);
      setCuponMsg(err.message || "Cupón inválido");
    } finally {
      setAplicandoCupon(false);
    }
  }

  /* ================= CONFIRMAR PAGO ================= */
  async function handleConfirm() {
    setIsProcessing(true);
    setMsg(null);

    try {
      let orderId = `TEMP-${Date.now()}`;

      // Armamos los items limpiamente, incluyendo los nuevos campos de grabado
      const itemsParaStrapi = items.map((item: any) => {
        const i: any = {
          producto: item.productId,
          product: item.productId,
          cantidad: item.cantidad,
          precio: item.precioUnitario,
          nombre: item.nombre,
          slug: item.slug,
          imagenUrl: item.imagenUrl
        };
        if (item.variantId) i.variantId = item.variantId;
        if (item.grabado) i.grabado = item.grabado;
        if (item.textoGrabado) i.textoGrabado = item.textoGrabado;
        return i;
      });

      // Armamos el payload dinámico para evitar enviar nulls a Strapi
      const dataPayload: any = {
        buyer,
        shipping: { ...shipping, costoEnvio: envioPrecio },
        items: itemsParaStrapi,
        total: totalPagar,
      };

      if (user?.id) dataPayload.cliente = user.id;
      if (cuponAplicado && codigoCupon) dataPayload.codigo_cupon = codigoCupon;

      const orden = await fetchFromStrapi("/ordens", {
        method: "POST",
        body: JSON.stringify({ data: dataPayload }),
      });

      // Si Strapi rechaza la orden, capturamos el mensaje exacto
      if (orden?.error) {
        const errorDetail = orden.error.message || JSON.stringify(orden.error);
        throw new Error(errorDetail);
      }

      if (orden?.data?.id) orderId = orden.data.id;

      // Mercado Pago
      const mpItems = items.map((item: any) => {
        // Le agregamos el texto del grabado al título para que salga en el recibo
        const tituloFinal = item.grabado && item.textoGrabado
          ? `${item.nombre} (Grabado: ${item.textoGrabado})`
          : item.nombre;

        return {
          title: tituloFinal,
          quantity: item.cantidad,
          unit_price: Math.round(Number(item.precioUnitario) * (1 - factor)),
        };
      });

      if (envioPrecio > 0) {
        mpItems.push({ title: "Costo de Envío", quantity: 1, unit_price: envioPrecio });
      }

      const mpRes = await fetch("/api/pago/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: String(orderId), items: mpItems }),
      });

      const mpData = await mpRes.json();
      if (!mpData.init_point) throw new Error("No se pudo generar el link de Mercado Pago");

      window.location.href = mpData.init_point;

    } catch (err: any) {
      // Ahora si falla algo de stock o datos, te lo va a escribir en rojo literal en la pantalla
      setMsg(err.message || "Hubo un error al iniciar el pago");
      setIsProcessing(false);
    }
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Stepper currentStep={4} />

        <div className="mt-12 space-y-3">
          {items.map((item: any) => {
            const precioOriginal = item.precioUnitario * item.cantidad;
            return (
              <div key={`${item.productId}-${item.variantId}`} className="flex items-center justify-between rounded-2xl bg-[#6B5E54] px-6 py-5 text-white shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={getImageFromCartItem(item)} alt={item.nombre} className="h-16 w-16 rounded-xl object-cover bg-white/10" />
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-xs opacity-80">Cantidad: {item.cantidad}</p>
                    {/* Sumamos visualmente el detalle del grabado si lo tiene */}
                    {item.grabado && item.textoGrabado && (
                      <p className="text-xs text-[#86EFAC] font-medium mt-1">
                        ✒️ Grabado: "{item.textoGrabado}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                  <span className="text-sm font-medium">${precioOriginal.toLocaleString("es-AR")}</span>
                </div>
              </div>
            );
          })}

          {envioPrecio > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-[#EBE7E0] border border-[#D6CEC5] px-6 py-4 text-[#5C5149] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-white text-2xl shadow-sm">🚚</div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">Costo de Envío</p>
                  <p className="text-xs text-gray-500">{envioDemora || "Envío a domicilio"}</p>
                </div>
              </div>
              <span className="text-sm font-bold">${envioPrecio.toLocaleString("es-AR")}</span>
            </div>
          )}

          {cuponAplicado && (
            <div className="flex items-center justify-between rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] px-6 py-4 text-[#2E7D32] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-white text-2xl shadow-sm">🏷️</div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">Descuento aplicado</p>
                  <p className="text-xs text-green-700 font-medium">{codigoCupon}</p>
                </div>
              </div>
              <span className="text-sm font-bold">- ${descuento.toLocaleString("es-AR")}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <input value={codigoCupon} disabled={cuponAplicado || aplicandoCupon} onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())} placeholder="CÓDIGO DE CUPÓN" className="rounded-full bg-[#E5DED6] px-5 py-2 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-[#6B5E54]" />
            <button onClick={aplicarCupon} disabled={aplicandoCupon || cuponAplicado || !codigoCupon} className="rounded-full bg-[#6B5E54] px-5 py-2 text-xs text-white shadow-sm disabled:opacity-50 transition-colors hover:bg-[#5a4e46]">
              {cuponAplicado ? "APLICADO" : aplicandoCupon ? "..." : "Aplicar"}
            </button>
          </div>
          {cuponMsg && <span className={`text-xs font-medium ml-1 ${cuponAplicado ? "text-green-700" : "text-red-600"}`}>{cuponMsg}</span>}
        </div>

        <div className="mt-12 flex justify-end">
          <div className="rounded-full bg-[#6B5E54] px-10 py-4 text-white shadow-lg flex items-center gap-3">
            <span className="font-bold text-xl">Total:</span>
            {cuponAplicado && (
              <span className="text-sm text-gray-300 line-through font-medium">
                ${precioOriginalTotal.toLocaleString("es-AR")}
              </span>
            )}
            <span className={`font-bold text-xl ${cuponAplicado ? "text-[#86EFAC]" : ""}`}>
              ${totalPagar.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        <div className="mt-10 flex justify-center pb-10">
          <button onClick={handleConfirm} disabled={isProcessing} className="flex items-center gap-3 rounded-full bg-[#009EE3] px-8 py-4 text-white font-bold hover:bg-[#008AC5] transition-all transform hover:scale-105 shadow-xl disabled:opacity-70">
            <img src="/mercadopago.svg" alt="MP" className="h-8 w-auto" />
            {isProcessing ? "Procesando..." : "Pagar con Mercado Pago"}
          </button>
        </div>

        {msg && <p className="text-center text-sm font-bold text-red-600 mb-6">⚠️ {msg}</p>}
      </div>
    </div>
  );
}