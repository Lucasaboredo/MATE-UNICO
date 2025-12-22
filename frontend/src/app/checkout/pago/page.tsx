"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper/Stepper";
import { useCart } from "@/lib/cartContext";
import { useCheckout } from "@/lib/checkoutContext";
import { fetchFromStrapi } from "@/lib/api";

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

  if (typeof direct === "string" && direct) {
    return toAbsoluteUrl(direct);
  }

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

  const { items, total, clearCart } = useCart();
  const { buyer, shipping } = useCheckout();

  const [msg, setMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ================= CUPÓN ================= */
  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState<string | null>(null);
  const [aplicandoCupon, setAplicandoCupon] = useState(false);

  const cuponAplicado = descuento > 0;

  /* ================= TOTALES ================= */
  const envio = Number(shipping.costoEnvio ?? 0);
  const totalFinal = Number(total) + envio;
  const totalConCupon = Math.max(totalFinal - descuento, 0);

  /* ================= PAYLOAD ORDEN ================= */
  const payload = useMemo(() => {
    return {
      buyer: {
        nombre: buyer.nombre,
        apellido: buyer.apellido,
        email: buyer.email,
        telefono: buyer.telefono,
      },
      shipping: {
        calle: shipping.calle,
        numero: shipping.numero,
        ciudad: shipping.ciudad,
        provincia: shipping.provincia,
        codigoPostal: shipping.codigoPostal,
        metodoEnvio: shipping.metodoEnvio,
        costoEnvio: shipping.costoEnvio,
      },
      items: (items || []).map((i: any) => ({
        productId: i.productId,
        variantId: i.variantId,
        nombre: i.nombre,
        precioUnitario: i.precioUnitario,
        cantidad: i.cantidad,
      })),
      total: totalConCupon,
      cliente: 1,
    };
  }, [buyer, shipping, items, totalConCupon]);

  /* ================= VALIDACIONES ================= */
  useEffect(() => {
    if (isProcessing || msg) return;

    if (!buyer.email) router.push("/checkout/datos");
    else if (!shipping.codigoPostal) router.push("/checkout/envio");
    else if (!items || items.length === 0) router.push("/carrito");
  }, [buyer, shipping, items, router, isProcessing, msg]);

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
            total: totalFinal,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Cupón inválido");
      }

      setDescuento(Number(data.descuento) || 0);
      setCuponMsg("Cupón aplicado correctamente");
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
      const orden = await fetchFromStrapi("/ordens", {
        method: "POST",
        body: JSON.stringify({ data: payload }),
      });

      const orderId = orden.data.id;

      const factor = descuento > 0 ? descuento / totalFinal : 0;

      const mpRes = await fetch("/api/pagos/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items: (items as any[]).map((item) => ({
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: Number(item.precioUnitario) * (1 - factor),
          })),
        }),
      });

      const mpData = await mpRes.json();

      if (!mpData.init_point) {
        throw new Error("No se pudo iniciar el pago");
      }

      clearCart();
      window.location.href = mpData.init_point;
    } catch (error) {
      console.error(error);
      setMsg("Hubo un error al iniciar el pago.");
      setIsProcessing(false);
    }
  }

  if (
    (!buyer.email || !shipping.codigoPostal || !items || items.length === 0) &&
    !msg
  ) {
    return null;
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Stepper currentStep={4} />

        {/* PRODUCTOS */}
        <div className="mt-12 space-y-5">
          {(items as any[]).map((item) => {
            const factor = cuponAplicado ? descuento / totalFinal : 0;
            const precioConDescuento =
              Number(item.precioUnitario) * (1 - factor);

            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-center justify-between rounded-2xl bg-[#6B5E54] px-6 py-5 text-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getImageFromCartItem(item)}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-xs">Cantidad: {item.cantidad}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {cuponAplicado && (
                    <span className="text-xs line-through opacity-70">
                      $
                      {Number(item.precioUnitario).toLocaleString("es-AR")}
                    </span>
                  )}
                  <span className="text-base font-semibold">
                    ${precioConDescuento.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CUPÓN + TOTAL */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              value={codigoCupon}
              disabled={cuponAplicado}
              onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
              placeholder="PRIMERA COMPRA"
              className={`rounded-full px-5 py-2 text-xs ${
                cuponAplicado
                  ? "bg-[#E5E5E5] text-[#5C5149]"
                  : "bg-[#E5DED6] text-[#5C5149]"
              }`}
            />

            {cuponAplicado ? (
              <span className="rounded-full bg-[#4F7A55] px-4 py-2 text-xs font-medium text-white">
                APLICADO
              </span>
            ) : (
              <button
                onClick={aplicarCupon}
                disabled={aplicandoCupon}
                className="rounded-full bg-[#6B5E54] px-5 py-2 text-xs text-white"
              >
                {aplicandoCupon ? "Aplicando..." : "Aplicar"}
              </button>
            )}
          </div>

          <div className="flex flex-col items-end rounded-full bg-[#6B5E54] px-7 py-3 text-white">
            {cuponAplicado && (
              <span className="text-xs line-through opacity-70">
                Total: ${totalFinal.toLocaleString("es-AR")}
              </span>
            )}
            <span className="text-sm font-semibold">
              Ahora: ${totalConCupon.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* BOTÓN MERCADO PAGO */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex items-center gap-3 rounded-full bg-[#009EE3] px-8 py-3 text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <img src="/mercadopago.svg" alt="Mercado Pago" className="h-6 w-6" />
            <span className="font-medium">
              {isProcessing ? "Redirigiendo..." : "Pagar con Mercado Pago"}
            </span>
          </button>
        </div>

        {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
      </div>
    </div>
  );
}
