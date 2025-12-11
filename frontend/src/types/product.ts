// src/types/product.ts

// 👇 Si en Strapi después agregan campos, se pueden sumar acá
export interface Variante {
  id: number;
  nombre: string;
  color?: string;
  stock?: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  material: string;
  activo: boolean;

  // Relación con variantes (puede venir vacío)
  variantes: Variante[];

  // Campos de fecha que vimos en el JSON de prueba
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;

  // Por ahora lo dejamos genérico
  categoria?: unknown;
}

// Respuesta típica de lista en Strapi
export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Respuesta típica de un solo recurso
export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

