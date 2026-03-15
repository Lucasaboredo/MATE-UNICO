import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

export default {
    async beforeCreate(event: any) {
        const { data } = event.params;

        if (data.items && data.items.length > 0) {
            for (const item of data.items) {
                const productoId = item.producto || item.product;
                if (!productoId) continue;

                // Le agregamos 'as any' para que TypeScript no tire error por los campos personalizados
                const producto = await strapi.entityService.findOne('api::producto.producto', productoId) as any;

                if (!producto) {
                    throw new ApplicationError(`El producto con ID ${productoId} no existe.`);
                }

                if (producto.stock < item.cantidad) {
                    throw new ApplicationError(`No hay stock suficiente para: ${producto.nombre || 'el producto'}. Stock actual: ${producto.stock}`);
                }
            }
        }
    }
};