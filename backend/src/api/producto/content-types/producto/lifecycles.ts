/**
 * Lifecycles para el modelo Producto
 * Auto-genera el slug desde el nombre si llega vacío/null
 */

function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
    .replace(/\s+/g, "-")             // Espacios → guiones
    .replace(/[^\w-]/g, "")          // Elimina caracteres especiales
    .replace(/--+/g, "-")            // Guiones múltiples → uno solo
    .replace(/^-+|-+$/g, "");        // Elimina guiones al inicio/final
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    if (!data.slug && data.nombre) {
      data.slug = generarSlug(data.nombre);
    }
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;
    if (!data.slug && data.nombre) {
      data.slug = generarSlug(data.nombre);
    }
  },
};
