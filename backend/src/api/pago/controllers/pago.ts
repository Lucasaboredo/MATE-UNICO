import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Configuración de Mercado Pago
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preferenceClient = new Preference(mpConfig);
const paymentClient = new Payment(mpConfig);

export default {
  // 1. CREAR PREFERENCIA
  async crearPreferencia(ctx) {
    try {
      const response = await preferenceClient.create({ body: ctx.request.body });
      ctx.send({ init_point: response.init_point });
    } catch (error) {
      ctx.send({ ok: false });
    }
  },

  // 2. WEBHOOK (Detecta pagos automáticos)
  async webhook(ctx) {
    console.log("🔔 [WEBHOOK] Recibiendo señal de Mercado Pago...");

    try {
      const query = ctx.request.query; 
      const body = ctx.request.body;
      
      console.log("📩 Datos recibidos:", JSON.stringify({ query, body }));

      let paymentId = body?.data?.id || query?.id || body?.id;
      const type = body?.type || query?.topic;

      // Si no hay ID o es una notificación de orden de comercio, ignoramos
      if (!paymentId) {
         console.log("⚠️ No se encontró ID de pago en la notificación.");
         return ctx.send({ ok: true });
      }
      if (type === "merchant_order") {
         return ctx.send({ ok: true });
      }
      
      console.log(`🔎 Consultando pago en MP: ${paymentId}`);
      const pago = await paymentClient.get({ id: paymentId });
      
      const orderId = pago.external_reference;
      const status = pago.status;
      
      console.log(`✅ Pago encontrado. Estado: ${status}. Orden asociada: ${orderId}`);

      if (orderId) {
        let estado: "pendiente" | "pagado" | "fallido" = "pendiente";
        if (status === "approved") estado = "pagado";
        if (status === "rejected" || status === "cancelled") estado = "fallido";

        console.log(`💾 Actualizando Orden #${orderId} a estado: ${estado}`);
        
        await strapi.entityService.update("api::orden.orden", Number(orderId), {
          data: { estado, payment_id: paymentId.toString() }
        });
        
        console.log("✨ ¡Orden actualizada con éxito vía Webhook!");
      }
      
      ctx.send({ ok: true });
    } catch (error) {
      console.error("🔥 Error en webhook:", error);
      ctx.send({ ok: false });
    }
  },

  // 3. ÉXITO (FIX FINAL: HTML Bridge para evitar bloqueo HTTPS -> HTTP)
  async exito(ctx) {
    try {
      // Capturamos todos los datos que manda MP en la URL
      const query = ctx.request.query;
      const { external_reference, status, collection_status, payment_id } = query;
      const finalStatus = status || collection_status;

      console.log("🚀 [REDIRECCIÓN] Cliente volvió de Mercado Pago. Estado:", finalStatus);

      // 1. PLAN B: Si está aprobado, actualizamos la orden YA MISMO
      if (finalStatus === 'approved' && external_reference) {
        console.log(`💾 Forzando actualización de Orden #${external_reference} a PAGADO`);
        await strapi.entityService.update("api::orden.orden", Number(external_reference), {
          data: { estado: 'pagado', payment_id: String(payment_id) }
        });
        console.log("✅ ¡Orden actualizada vía Redirección (Plan B)!");
      }

      // 2. REDIRECCIÓN SEGURA: Preparamos la URL final con los datos
      const params = new URLSearchParams(query as any).toString();
      const targetUrl = `http://localhost:3000/checkout/exito?${params}`;

      // 👇 AQUÍ ESTÁ LA MAGIA: Devolvemos HTML real en lugar de redirect ciego.
      ctx.set('Content-Type', 'text/html');
      ctx.body = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Redirigiendo...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f4f4f5; margin: 0;">
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: #2F4A2D; margin: 0 0 0.5rem 0;">¡Pago Recibido!</h2>
            <p style="color: #71717a; margin-bottom: 2rem;">Te estamos llevando de vuelta a tu orden...</p>
            
            <a href="${targetUrl}" style="background-color: #2F4A2D; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: bold; transition: opacity 0.2s;">
              Haz clic aquí si no redirige automáticamente
            </a>
          </div>
          <script>
            setTimeout(() => {
              window.location.href = "${targetUrl}";
            }, 1000);
          </script>
        </body>
        </html>
      `;

    } catch (error) {
      console.error("⚠️ Error en redirección exito:", error);
      // En caso de error, usamos el redirect normal
      return ctx.redirect('http://localhost:3000/checkout/exito');
    }
  },

  // 4. OTROS ESTADOS
  async error(ctx) { 
    return ctx.redirect('http://localhost:3000/checkout/error'); 
  },
  
  async pendiente(ctx) { 
    return ctx.redirect('http://localhost:3000/checkout/pendiente'); 
  }
};