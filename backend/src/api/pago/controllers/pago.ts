import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preferenceClient = new Preference(mpConfig);
const paymentClient = new Payment(mpConfig);

export default {
  /* ======================================================
     CREAR PREFERENCIA DE MERCADO PAGO
     Usado por el frontend (/api/pagos/preferencia)
  ====================================================== */
  async crearPreferencia(ctx) {
    try {
      const { orderId, items } = ctx.request.body;

      if (!orderId || !items || items.length === 0) {
        return ctx.badRequest("Datos incompletos");
      }

      // 🔎 Buscar la orden existente
      const orden = await strapi.entityService.findOne(
        "api::orden.orden",
        orderId
      );

      if (!orden) {
        return ctx.notFound("Orden no encontrada");
      }

      // 🧾 Preferencia Mercado Pago
      const preference = {
        items,
        external_reference: orderId.toString(), // 🔗 clave para webhook
        notification_url: `${process.env.PUBLIC_URL}/api/pagos/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/exito`,
          failure: `${process.env.FRONTEND_URL}/checkout/error`,
          pending: `${process.env.FRONTEND_URL}/checkout/pendiente`,
        },
        auto_return: "approved",
      };

      const response = await preferenceClient.create({
        body: preference,
      });

      ctx.send({
        init_point: response.init_point,
      });
    } catch (error) {
      console.error("❌ Error creando preferencia:", error);
      ctx.internalServerError("Error Mercado Pago");
    }
  },

  /* ======================================================
     WEBHOOK MERCADO PAGO
     Llamado automáticamente por Mercado Pago
  ====================================================== */
  async webhook(ctx) {
    try {
      const { type, data } = ctx.request.body;

      // MP envía muchos eventos, solo nos interesa payment
      if (type !== "payment") {
        return ctx.send({ ok: true });
      }

      const paymentId = data.id;

      // 🔎 Consultar pago real a Mercado Pago
      const pago = await paymentClient.get({ id: paymentId });

      const statusMP = pago.status; // approved | rejected | pending
      const orderId = pago.external_reference;

      if (!orderId) {
        console.warn("⚠️ Pago sin external_reference");
        return ctx.send({ ok: true });
      }

      // 🔁 Mapear estado MP -> estado del sistema
      let estado: "pendiente" | "pagado" | "fallido" = "pendiente";

      if (statusMP === "approved") estado = "pagado";
      if (statusMP === "rejected" || statusMP === "cancelled")
        estado = "fallido";

      // 🗄️ Actualizar la orden en Strapi
      await strapi.entityService.update(
        "api::orden.orden",
        Number(orderId),
        {
          data: {
            estado,
            payment_id: paymentId.toString(),
            payment_status: statusMP,
            fecha_pago:
              statusMP === "approved"
                ? new Date().toISOString()
                : null,
          },
        }
      );

      ctx.send({ ok: true });
    } catch (error) {
      console.error("❌ Error webhook MP:", error);
      ctx.send({ ok: false });
    }
  },
};
