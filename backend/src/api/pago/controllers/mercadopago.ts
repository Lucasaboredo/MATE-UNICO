import {
  crearPreferenciaMP,
  obtenerPagoMP,
  procesarCompraExitosa,
  marcarOrdenFallida,
} from "../services/mercadopago";
import { enviarEmailConfirmacionOrden } from "../services/email";

function getFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:3000").trim();
}

export default {
  async crearPreferencia(ctx: any) {
    try {
      console.log("🧾 BODY PREFERENCIA:");
      console.log(JSON.stringify(ctx.request.body, null, 2));

      const response = await crearPreferenciaMP(ctx.request.body);
      ctx.send({ init_point: response.init_point });
    } catch (error) {
      console.error("❌ Error creando preferencia:", error);
      ctx.send({ ok: false });
    }
  },

  async webhook(ctx: any) {
    console.log("🔔 [WEBHOOK] Señal Mercado Pago...");

    try {
      const query = ctx.request.query;
      const body = ctx.request.body;

      const paymentId = body?.data?.id || query?.id || body?.id;
      const type = body?.type || query?.topic;

      // MP manda un primer webhook merchant_order que no nos sirve
      if (!paymentId || type === "merchant_order") {
        return ctx.send({ ok: true });
      }

      const pago = await obtenerPagoMP(paymentId);
      const orderId = Number(pago.external_reference);
      const status = pago.status;

      console.log(`🔎 Webhook: Orden ${orderId} | Estado MP: ${status} | paymentId: ${paymentId}`);

      if (orderId && status === "approved") {
        // 1) stock + orden pagada
        await procesarCompraExitosa(orderId, String(paymentId));

        // 2) email (con logs del resultado)
        try {
          const resEmail = await enviarEmailConfirmacionOrden(orderId, String(paymentId));

          console.log("📧 [EMAIL] Resultado:", resEmail);
        } catch (e: any) {
          console.error("❌ [EMAIL] Falló enviarEmailConfirmacionOrden:", e?.message || e);
        }

        return ctx.send({ ok: true });
      }

      if (orderId && (status === "rejected" || status === "cancelled")) {
        await marcarOrdenFallida(orderId, String(paymentId), status);
        return ctx.send({ ok: true });
      }

      return ctx.send({ ok: true });
    } catch (error) {
      console.error("🔥 Error en webhook:", error);
      ctx.send({ ok: false });
    }
  },

  // ✅ exito SOLO redirige (sin tocar orden / email)
  async exito(ctx: any) {
    try {
      const query = ctx.request.query;
      const FRONTEND_URL = getFrontendUrl();

      const params = new URLSearchParams(query as any).toString();
      const targetUrl = `${FRONTEND_URL}/checkout/exito?${params}`;

      console.log("🔁 [EXITO] Redirigiendo a:", targetUrl);

      ctx.set("Content-Type", "text/html");
      ctx.body = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <title>Redirigiendo…</title>
            <meta http-equiv="refresh" content="0; url=${targetUrl}" />
          </head>
          <body>
            <p>Redirigiendo a tu orden…</p>
            <p>Si no te redirige, tocá acá: <a href="${targetUrl}">Continuar</a></p>
          </body>
        </html>
      `;
    } catch (error) {
      console.error("⚠️ Error en redirección exito:", error);
      return ctx.redirect(`${getFrontendUrl()}/checkout/exito`);
    }
  },

  async error(ctx: any) {
    return ctx.redirect(`${getFrontendUrl()}/checkout/error`);
  },

  async pendiente(ctx: any) {
    return ctx.redirect(`${getFrontendUrl()}/checkout/pendiente`);
  },
};




