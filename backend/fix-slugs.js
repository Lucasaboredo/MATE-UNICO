/**
 * Script para poblar slugs en productos existentes con slug null.
 * Ejecutar con: node fix-slugs.js
 */

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, ".tmp", "data.db");
const db = new Database(dbPath);

function generarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Buscar productos con slug null
const productos = db.prepare("SELECT id, nombre, document_id FROM productos WHERE slug IS NULL").all();

console.log(`\n🔍 Encontré ${productos.length} producto(s) con slug null:\n`);

if (productos.length === 0) {
  console.log("✅ No hay productos sin slug. Todo está bien.");
  db.close();
  process.exit(0);
}

const update = db.prepare("UPDATE productos SET slug = ? WHERE id = ?");

for (const producto of productos) {
  const baseSlug = generarSlug(producto.nombre);
  // Si el slug base ya existe, agregar el id para hacerlo único
  const existing = db.prepare("SELECT id FROM productos WHERE slug = ? AND id != ?").get(baseSlug, producto.id);
  const slug = existing ? `${baseSlug}-${producto.id}` : baseSlug;

  update.run(slug, producto.id);
  console.log(`  ✅ ${producto.nombre} → slug: "${slug}"`);
}

db.close();
console.log("\n🎉 ¡Slugs actualizados exitosamente!");
