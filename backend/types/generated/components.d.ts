import type { Schema, Struct } from '@strapi/strapi';

export interface InventarioVariantes extends Struct.ComponentSchema {
  collectionName: 'components_inventario_variantes';
  info: {
    displayName: 'Variantes';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'inventario.variantes': InventarioVariantes;
    }
  }
}
