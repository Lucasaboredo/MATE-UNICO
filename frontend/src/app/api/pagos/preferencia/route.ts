export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuración Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preferenceClient = new Preference(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items } = body;

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const preference = {
      items: items.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "ARS",
      })),

      external_reference: String(orderId),

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/exito`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/fallo`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/pago`,
      },
    };

    const response = await preferenceClient.create({
      body: preference,
    });

    return NextResponse.json({
      init_point: response.init_point,
    });

  } catch (error) {
    console.error("❌ ERROR MP:", error);

    return NextResponse.json(
      { error: "Error creando preferencia" },
      { status: 500 }
    );
  }
}
