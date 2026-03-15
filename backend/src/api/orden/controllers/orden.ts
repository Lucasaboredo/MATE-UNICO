import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::orden.orden', ({ strapi }) => ({
  async create(ctx) {
    // @ts-ignore
    const { items } = ctx.request.body.data;

    if (!items || !Array.isArray(items)) {
      return ctx.badRequest("No hay productos en la orden");
    }

    for (const item of items) {
      const idABuscar = item.producto || item.product || item.productId;

      if (!idABuscar) continue;

      // Traemos el producto con sus variantes
      const productoReal: any = await strapi.entityService.findOne('api::producto.producto', idABuscar, {
        populate: ['variantes'],
      });

      if (!productoReal) {
        return ctx.badRequest(`El producto con ID ${idABuscar} no existe.`);
      }

      let stockDisponible = 0;

      // Lógica robusta de detección de stock
      if (productoReal.variantes && productoReal.variantes.length > 0) {
        if (item.variantId) {
          // Buscamos la variante específica. 
          // Usamos == para permitir comparación de string vs number sin errores de tipo.
          const variante = productoReal.variantes.find((v: any) => v.id == item.variantId);

          if (variante) {
            stockDisponible = Number(variante.stock || 0);
          } else {
            // Si mandó un ID que no se encuentra (a veces los IDs de componentes cambian), 
            // tomamos el stock de la primera variante disponible como respaldo.
            stockDisponible = Number(productoReal.variantes[0].stock || 0);
          }
        } else {
          // Si no hay variante seleccionada, sumamos el stock de todas las variantes
          stockDisponible = productoReal.variantes.reduce((acc: number, v: any) => acc + Number(v.stock || 0), 0);
        }
      } else {
        // Si el producto no tiene el componente variantes, buscamos stock en la raíz
        stockDisponible = Number(productoReal.stock || 0);
      }

      // LOGS DE CONTROL
      console.log(`🔎 Verificando: ${productoReal.nombre}`);
      console.log(`   - ID variante pedido: ${item.variantId}`);
      console.log(`   - Stock encontrado: ${stockDisponible}`);

      if (stockDisponible <= 0) {
        return ctx.badRequest(`Lo sentimos, "${productoReal.nombre}" no tiene stock disponible.`);
      }

      if (stockDisponible < item.cantidad) {
        return ctx.badRequest(`Solo quedan ${stockDisponible} unidades de "${productoReal.nombre}".`);
      }
    }

    // Si todo está OK, crear la orden
    return await super.create(ctx);
  },

  async findMine(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('No estás autenticado');

    try {
      const data = await strapi.entityService.findMany('api::orden.orden', {
        filters: { cliente: user.id },
        sort: { createdAt: 'desc' },
      });
      return { data: await this.sanitizeOutput(data, ctx) };
    } catch (error) {
      return ctx.badRequest("Error al buscar órdenes");
    }
  }
}));