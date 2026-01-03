import nodemailer from "nodemailer";
import { renderOrdenConfirmadaHTML } from "../utils/emailTemplates";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Faltan variables SMTP en .env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ✅ helper: buscar orden por id o por payment_id
async function buscarOrdenParaEmail(orderId: number, paymentId?: string) {
  // 1) intento por ID directo
  const byId = (await strapi.entityService.findOne("api::orden.orden", orderId)) as any;
  if (byId) return byId;

  // 2) fallback: buscar por payment_id si lo tenemos
  if (paymentId) {
    const found = (await strapi.entityService.findMany("api::orden.orden", {
      filters: { payment_id: paymentId },
      sort: { createdAt: "desc" },
      limit: 1,
    })) as any[];

    if (found && found.length > 0) return found[0];
  }

  return null;
}

export async function enviarEmailConfirmacionOrden(orderId: number, paymentId?: string) {
  // ✅ buscamos orden robusto
  const orden = (await buscarOrdenParaEmail(orderId, paymentId)) as any;

  if (!orden) {
    console.log("📧 [EMAIL] Orden no encontrada ni por id ni por payment_id.", {
      orderId,
      paymentId,
    });
    return { ok: false, reason: "orden_no_encontrada" };
  }

  // ✅ idempotencia
  if (orden.email_confirmacion_enviado_at) {
    console.log("📧 [EMAIL] Ya enviada confirmación.");
    return { ok: true, alreadySent: true };
  }

  const buyer = orden.buyer;
  const to = buyer?.email || buyer?.mail;

  if (!to) {
    console.log("⚠️ [EMAIL] No encontramos buyer.email/buyer.mail en la orden.");
    return { ok: false, reason: "sin_email_destino" };
  }

  const html = renderOrdenConfirmadaHTML({
    ordenId: orden.id,
    total: orden.total,
    buyer: orden.buyer,
    shipping: orden.shipping,
    items: orden.items || [],
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const subject = `✅ Confirmación de compra — Orden #${orden.id}`;

  const transporter = getTransporter();

  try {
    await transporter.sendMail({ from, to, subject, html });

    console.log(`📨 [EMAIL] Confirmación enviada a ${to} (Orden #${orden.id}).`);

    await strapi.entityService.update("api::orden.orden", orden.id, {
      data: { email_confirmacion_enviado_at: new Date() },
    });

    return { ok: true, alreadySent: false };
  } catch (err: any) {
    console.error("❌ [EMAIL] Error enviando mail:", err?.message || err);
    return { ok: false, reason: "smtp_error", error: err?.message || String(err) };
  }
}

