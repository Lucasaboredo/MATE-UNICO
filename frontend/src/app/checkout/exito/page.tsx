"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutExitoPage() {
  const params = useSearchParams();

  const paymentId = params.get("payment_id");
  const status = params.get("status");
  const externalRef = params.get("external_reference");

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-green-600">
        ¡Pago exitoso!
      </h1>

      <p className="mt-4 text-gray-600">
        Gracias por tu compra. Estamos procesando tu orden.
      </p>

      <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left text-sm">
        <p><b>Estado:</b> {status ?? "pendiente"}</p>
        <p><b>Payment ID:</b> {paymentId ?? "—"}</p>
        <p><b>Orden:</b> {externalRef ?? "—"}</p>
      </div>
    </div>
  );
}
