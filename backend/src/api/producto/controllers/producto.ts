/**
 * producto controller - Custom Catalog Endpoint (Strapi v5 + TypeScript)
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::producto.producto",
  ({ strapi }) => ({
    async catalogo(ctx) {
      const { categoria, material, precio_min, precio_max, search } = ctx.query;

      const filters: any = {};

      // Filtro por categoría
      if (categoria) {
        filters.categoria = {
          nombre: {
            $eq: categoria,
          },
        };
      }

      // Filtro por material
      if (material) {
        filters.material = {
          $eq: material,
        };
      }

      // Filtro por rango de precio
      if (precio_min || precio_max) {
        filters.precioBase = {};
        if (precio_min) filters.precioBase.$gte = Number(precio_min);
        if (precio_max) filters.precioBase.$lte = Number(precio_max);
      }

      // Búsqueda por nombre o descripción
      if (search) {
        filters.$or = [
          { nombre: { $containsi: search } },
          { descripcion: { $containsi: search } },
        ];
      }

      // Consulta a la base con populate corregido para TS
      const productos = await strapi.entityService.findMany(
        "api::producto.producto",
        {
          filters,
          populate: {
            categoria: true,
            variantes: true, // ⭐ IMPORTANTE: objeto, NO array
          },
          sort: { nombre: "asc" },
        }
      );

      return productos;
    },
  })
);
