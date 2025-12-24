export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preferenceClient = new Preference(client);

export async function POST(req: Request) {
  try {
    const { orderId, items } = await req.json();

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.trim();
    const isPublicHttps = siteUrl.startsWith("https://");

    const preference: any = {
      items: items.map((item: any) => ({
        title: item.title,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price) || 0,
        currency_id: "ARS",
      })),
      external_reference: String(orderId),
      back_urls: {
        success: `${siteUrl}/checkout/exito`,
        failure: `${siteUrl}/checkout/error`,
        pending: `${siteUrl}/checkout/pendiente`,
      },
    };

    if (isPublicHttps) {
      preference.auto_return = "approved";
    }

    const response = await preferenceClient.create({ body: preference });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error("❌ ERROR MP:", error);
    return NextResponse.json(
      { error: "Error creando preferencia" },
      { status: 500 }
    );
  }
}

