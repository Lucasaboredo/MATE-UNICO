module.exports = {
  async validar(ctx) {
    const body = ctx.request.body || {};
    const codigo = body.codigo;
    const total = Number(body.total);

    if (!codigo || isNaN(total)) {
      return ctx.badRequest("Código o total inválido");
    }

    const cupon = await strapi.db
      .query("api::cupon.cupon")
      .findOne({
        where: {
          codigo: codigo.toUpperCase(),
          activo: true,
        },
      });

    if (!cupon) {
      return ctx.badRequest("Cupón inexistente o inactivo");
    }

    if (
      cupon.fecha_vencimiento &&
      new Date(cupon.fecha_vencimiento) < new Date()
    ) {
      return ctx.badRequest("El cupón está vencido");
    }

    if (cupon.monto_minimo && total < cupon.monto_minimo) {
      return ctx.badRequest(
        `El monto mínimo es $${cupon.monto_minimo}`
      );
    }

    if (
      cupon.max_usos &&
      cupon.usos_realizados >= cupon.max_usos
    ) {
      return ctx.badRequest("Este cupón ya alcanzó su límite");
    }

    let descuento = 0;

    if (cupon.tipo === "porcentaje") {
      descuento = (total * cupon.valor) / 100;
    } else {
      descuento = cupon.valor;
    }

    const total_final = Math.max(total - descuento, 0);

    ctx.send({
      valido: true,
      codigo: cupon.codigo,
      descuento,
      total_final,
    });
  },
};
