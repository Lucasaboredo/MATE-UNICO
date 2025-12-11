// src/lib/products.ts
import { fetchFromStrapi } from "@/lib/api";

/**
 * Devuelve TODOS los productos desde Strapi
 * Endpoint: GET /api/productos?populate=*
 */
export async function getAllProducts() {
  return fetchFromStrapi("/api/productos?populate=*");
}

/**
 * Devuelve UN producto por id
 * Endpoint: GET /api/productos/:id?populate=*
 */
export async function getProductById(id: number | string) {
  return fetchFromStrapi(`/api/productos/${id}?populate=*`);
}
