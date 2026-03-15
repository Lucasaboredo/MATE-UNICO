import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cupon.cupon', ({ strapi }) => ({
  async validar(ctx) {
    const { codigo, total, clienteId } = ctx.request.body;

    if (!codigo || !total) return ctx.badRequest('Faltan datos requeridos');

    // 1. Validar que el cupón existe
    const cupones = await strapi.entityService.findMany('api::cupon.cupon', {
      filters: { codigo },
    });

    if (!cupones || cupones.length === 0) return ctx.badRequest('El cupón no existe');
    const cupon = cupones[0];

    // 2. Validar que esté activo
    if (!cupon.activo) return ctx.badRequest('El cupón no está activo');

    // 3. Validar fecha de vencimiento
    if (cupon.fecha_vencimiento && new Date(cupon.fecha_vencimiento) < new Date()) {
      return ctx.badRequest('El cupón ha expirado');
    }

    // 4. Validar monto mínimo
    if (cupon.monto_minimo && total < Number(cupon.monto_minimo)) {
      return ctx.badRequest(`El monto mínimo para este cupón es de $${cupon.monto_minimo}`);
    }

    // 5. Validar límite de usos globales (si tiene max_usos definido)
    if (cupon.max_usos && cupon.usos_realizados >= cupon.max_usos) {
      return ctx.badRequest('El cupón ha alcanzado su límite de usos');
    }

    // 6. Validar un solo uso por usuario (Requiere que mandes el clienteId)
    if (clienteId) {
      const ordenesPrevias = await strapi.entityService.findMany('api::orden.orden', {
        filters: {
          cliente: clienteId,
          codigo_cupon: codigo,
          estado: 'pagado' // ✅ Corregido para que coincida con tu esquema
        }
      });

      if (ordenesPrevias && ordenesPrevias.length > 0) {
        return ctx.badRequest('Ya has utilizado este cupón anteriormente');
      }
    }

    // 7. Aplicar descuento
    let descuento = 0;
    if (cupon.tipo === 'porcentaje') {
      descuento = total * (Number(cupon.valor) / 100);
    } else if (cupon.tipo === 'monto-fijo') {
      descuento = Number(cupon.valor);
    }

    // Evitar descuentos mayores al total
    descuento = Math.min(descuento, total);

    return ctx.send({ descuento, message: 'Cupón válido' });
  }
}));