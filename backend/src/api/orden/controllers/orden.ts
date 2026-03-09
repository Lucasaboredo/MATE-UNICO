import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::orden.orden', ({ strapi }) => ({
  async create(ctx) {
    // @ts-ignore
    const { items } = ctx.request.body.data;

    if (!items || !Array.isArray(items)) {
      return ctx.badRequest("No hay productos en la orden");
    }

    // Validación de Stock Real
    for (const item of items) {
      // Cargamos el producto con sus variantes para encontrar el stock
      const productoReal: any = await strapi.entityService.findOne('api::producto.producto', item.productId, {
        populate: { variantes: true },
      });

      if (!productoReal) {
        return ctx.badRequest(`El producto con ID ${item.productId} no existe.`);
      }

      // Lógica de búsqueda de stock:
      // 1. Si el ítem tiene una variante específica, buscamos el stock en esa variante.
      // 2. Si no tiene variante (o el modelo no usa variantes para ese producto),
      //    intentamos buscar un campo 'stock' general (por si acaso).
      
      let stockDisponible = 0;
      
      if (item.variantId && productoReal.variantes) {
        const variante = productoReal.variantes.find((v: any) => v.id === item.variantId);
        stockDisponible = variante ? (variante.stock || 0) : 0;
      } else {
        // Si no hay variantId, buscamos el stock en el producto (si existiera el campo)
        stockDisponible = productoReal.stock ?? 0;
      }

      if (stockDisponible <= 0) {
        return ctx.badRequest(`Lo sentimos, "${productoReal.nombre}" no tiene stock disponible.`);
      }

      if (stockDisponible < item.cantidad) {
        return ctx.badRequest(`Solo quedan ${stockDisponible} unidades de "${productoReal.nombre}".`);
      }
    }

    // Si pasa todas las validaciones, se crea la orden
    const response = await super.create(ctx);
    return response;
  },

  async findMine(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('No estás autenticado');
    }

    try {
      const data = await strapi.entityService.findMany('api::orden.orden', {
        filters: { cliente: user.id },
        sort: { createdAt: 'desc' },
      });

      if (!data) return { data: [] };

      const sanitizedData = await this.sanitizeOutput(data, ctx);
      return { data: sanitizedData };
    } catch (error) {
      return ctx.badRequest("Error al buscar órdenes");
    }
  }
}));