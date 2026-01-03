import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Config Mercado Pago
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preferenceClient = new Preference(mpConfig);
const paymentClient = new Payment(mpConfig);

export async function crearPreferenciaMP(body: any) {
  return await preferenceClient.create({ body });
}

export async function obtenerPagoMP(paymentId: string | number) {
  return await paymentClient.get({ id: paymentId });
}

/**
 * DESCONTAR STOCK Y CONFIRMAR ORDEN
 * - Hace update de stock por variantes
 * - Marca orden como pagado / fallido
 * - Idempotencia mínima por payment_id
 */
export async function procesarCompraExitosa(orderId: number, paymentId: string) {
  console.log(`\n📉 [STOCK] Iniciando proceso para Orden #${orderId}`);

  const orden = (await strapi.entityService.findOne("api::orden.orden", orderId)) as any;

  if (!orden) {
    console.log("❌ [STOCK] Orden no encontrada.");
    return { ok: false, reason: "orden_no_encontrada" };
  }

  // ✅ Idempotencia: si ya está pagada con el mismo payment_id, salimos
  if (orden.estado === "pagado" && orden.payment_id && String(orden.payment_id) === String(paymentId)) {
    console.log("✅ [IDEMPOTENTE] Orden ya pagada con este payment_id. No reprocesamos.");
    return { ok: true, alreadyProcessed: true };
  }

  const items = (orden.items || []) as any[];

  if (!items || items.length === 0) {
    console.log("⚠️ [STOCK] La orden no tiene items.");
    return { ok: false, reason: "sin_items" };
  }

  for (const item of items) {
    const productId = Number(item.productId);
    const variantId = Number(item.variantId);
    const cantidad = Number(item.cantidad);

    console.log(`👉 Item: Producto ${productId} | Variante ${variantId} | Cantidad ${cantidad}`);

    try {
      const producto = (await strapi.entityService.findOne("api::producto.producto", productId, {
        populate: "*",
      })) as any;

      if (!producto) {
        console.log(`❌ [STOCK] Producto ${productId} no encontrado.`);
        continue;
      }

      if (producto.variantes && Array.isArray(producto.variantes)) {
        let stockActualizado = false;

        const variantesActualizadas = producto.variantes.map((v: any) => {
          if (Number(v.id) === variantId) {
            const stockAnterior = Number(v.stock);
            const nuevoStock = Math.max(0, stockAnterior - cantidad);

            console.log(`   ✅ Variante "${v.nombre ?? v.id}" stock ${stockAnterior} ➡️ ${nuevoStock}`);

            stockActualizado = true;
            return { ...v, stock: nuevoStock };
          }
          return v;
        });

        if (stockActualizado) {
          await strapi.entityService.update("api::producto.producto", productId, {
            data: { variantes: variantesActualizadas },
          });
          console.log(`   💾 Stock actualizado en DB (producto ${productId})`);
        } else {
          console.log(`   ⚠️ No match variante ${variantId} en producto ${productId}`);
        }
      } else {
        console.log(`   ⚠️ Producto ${productId} no tiene variantes`);
      }
    } catch (err) {
      console.error(`❌ [ERROR] Actualizando stock producto ${productId}:`, err);
    }
  }

  // Marca orden pagada
  await strapi.entityService.update("api::orden.orden", orderId, {
    data: {
      estado: "pagado",
      payment_id: paymentId,
      fecha_pago: new Date(),
    },
  });

  console.log("✨ [FIN] Orden marcada como pagada.\n");
  return { ok: true, alreadyProcessed: false };
}

export async function marcarOrdenFallida(orderId: number, paymentId: string, status?: string) {
  await strapi.entityService.update("api::orden.orden", orderId, {
    data: {
      estado: "fallido",
      payment_id: paymentId,
      payment_status: status || "rejected",
    },
  });
}
