export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Falta la variable ${name} en frontend/.env.local`);
  }
  return v.trim();
}

export async function POST(req: Request) {
  try {
    const MP_ACCESS_TOKEN = mustGetEnv("MP_ACCESS_TOKEN");

    // ✅ IMPORTANTE: BACKEND_URL tiene que ser el NGROK del backend (https)
    const BACKEND_URL = mustGetEnv("NEXT_PUBLIC_BACKEND_URL");

    // Si no es https, MP suele rechazar los back_urls (y tira ese error genérico)
    if (!BACKEND_URL.startsWith("https://")) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_BACKEND_URL debe ser https (ngrok del backend). Ej: https://xxxx.ngrok-free.dev",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;
    const items = body?.items;

    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Body inválido: se requiere { orderId, items[] }" },
        { status: 400 }
      );
    }

    const normalizedItems = items.map((item: any) => ({
      title: String(item?.title || "Producto"),
      quantity: Math.max(1, Number(item?.quantity || 1)),
      unit_price: Number(item?.unit_price ?? item?.price ?? 0),
      currency_id: "ARS",
    }));

    if (
      normalizedItems.some(
        (i) => !Number.isFinite(i.unit_price) || i.unit_price <= 0
      )
    ) {
      return NextResponse.json(
        { error: "Items inválidos: unit_price debe ser un número > 0" },
        { status: 400 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preferenceClient = new Preference(client);

    // ✅ CLAVE: back_urls públicas (ngrok del backend) -> Strapi redirige al frontend local
    const preference: any = {
      items: normalizedItems,
      external_reference: String(orderId),

      notification_url: `${BACKEND_URL}/api/pago/webhook`,

      back_urls: {
        success: `${BACKEND_URL}/api/pago/exito`,
        failure: `${BACKEND_URL}/api/pago/error`,
        pending: `${BACKEND_URL}/api/pago/pendiente`,
      },

      auto_return: "approved",
    };

    console.log("✅ BACKEND_URL:", BACKEND_URL);
    console.log("🔔 notification_url:", preference.notification_url);
    console.log("🔁 back_urls:", preference.back_urls);

    const response = await preferenceClient.create({ body: preference });

    return NextResponse.json({ init_point: response.init_point });
  } catch (err: any) {
    console.error("❌ /api/pago/preferencia error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Error interno creando preferencia" },
      { status: 500 }
    );
  }
}

