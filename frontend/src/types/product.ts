export interface Imagen {
  id: number;
  url: string;
}

export interface Variante {
  id: number;
  nombre: string;
  precio?: number;
  stock: number;
  codigo_color?: string;
  indice_imagen?: number;
}

export interface Opinion {
  id: number;
  Puntuacion: number;
  Texto: string;
  createdAt: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Producto {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  activo: boolean;
  material?: string;
  slug: string;
  destacado: boolean;
  imagen?: Imagen[];
  variantes?: Variante[];
  categoria?: Categoria;
  opinions?: Opinion[];
  permite_grabado: boolean;
  // ✨ CAMPOS DE PROMOCIÓN
  en_promocion: boolean;
  precio_oferta?: number;
}