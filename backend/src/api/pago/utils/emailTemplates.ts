type Item = {
  productId?: number | string;
  variantId?: number | string;
  cantidad?: number | string;
  nombre?: string;
  varianteNombre?: string;
  precioUnitario?: number | string;
};

export function renderOrdenConfirmadaHTML(params: {
  ordenId: number;
  total: number | string;
  buyer?: any;     // json
  shipping?: any;  // json
  items: Item[];
}) {
  const { ordenId, total, buyer, shipping, items } = params;

  const nombre = buyer?.name || buyer?.nombre || "Cliente";
  const email = buyer?.email || buyer?.mail || "";

  const direccionTexto = shipping
    ? [
        shipping?.address?.street_name,
        shipping?.address?.street_number,
        shipping?.address?.zip_code ? `CP ${shipping.address.zip_code}` : null,
        shipping?.receiver_address?.city_name,
        shipping?.receiver_address?.state_name,
      ]
        .filter(Boolean)
        .join(" ")
    : "Dirección no disponible";

  const itemsHtml = (items || [])
    .map((i) => {
      const n = i.nombre ?? `Producto ${i.productId ?? ""}`;
      const v = i.varianteNombre ? ` (${i.varianteNombre})` : "";
      const c = i.cantidad ?? 1;
      const p = i.precioUnitario ? ` — $${i.precioUnitario}` : "";
      return `<li style="margin:6px 0;">${n}${v} — x${c}${p}</li>`;
    })
    .join("");

  const logoUrl = "https://via.placeholder.com/180x60?text=Mate+Unico"; // si tienen logo público lo cambiamos

  return `
  <div style="font-family: Arial, sans-serif; background:#f7f5f2; padding:24px;">
    <div style="max-width: 640px; margin: 0 auto; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e7e2dc;">
      <div style="background:#5F6B58; padding:18px 20px;">
        <img src="${logoUrl}" alt="Mate Único" style="height:40px; display:block;" />
      </div>

      <div style="padding:20px;">
        <h2 style="margin:0 0 10px;">¡Gracias por tu compra, ${nombre}! ✅</h2>
        <p style="margin:0 0 16px; color:#333;">
          Tu pago fue confirmado. Te dejamos el detalle de tu orden.
        </p>

        <div style="background:#F9E2C3; padding:12px 14px; border-radius:10px; margin-bottom:16px;">
          <strong>Orden #${ordenId}</strong><br/>
          <span>Total pagado: <strong>$${total}</strong></span><br/>
          ${email ? `<span style="font-size:12px;color:#444;">${email}</span>` : ""}
        </div>

        <h3 style="margin:0 0 8px;">Productos</h3>
        <ul style="padding-left:18px; margin:0 0 16px;">
          ${itemsHtml || "<li>Sin items</li>"}
        </ul>

        <h3 style="margin:0 0 8px;">Dirección de envío</h3>
        <p style="margin:0 0 18px; color:#333;">${direccionTexto}</p>

        <p style="margin:0; color:#666; font-size: 13px;">
          Si tenés alguna duda, respondé este mail y te ayudamos.
        </p>
      </div>

      <div style="padding:14px 20px; background:#f2eee9; color:#666; font-size:12px;">
        Mate Único — Post-compra
      </div>
    </div>
  </div>
  `;
}
