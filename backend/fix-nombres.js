/**
 * Script para actualizar nombres de productos y variantes con nombres comerciales.
 */

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, ".tmp", "data.db");
const db = new Database(dbPath);

// Formato: { productoId, varianteId, nuevoNombreProducto, nuevoNombreVariante }
const ACTUALIZACIONES = [
  // --- METALES ---
  {
    productoId: 115,
    varianteId: 99,
    nuevoNombreProducto: "El Plateado",
    nuevoNombreVariante: "Acero Pulido",
  },
  {
    productoId: 133,
    varianteId: 117,
    nuevoNombreProducto: "El Montañés",
    nuevoNombreVariante: "Acero Cepillado",
  },

  // --- CALABAZAS ---
  {
    productoId: 137,
    varianteId: 121,
    nuevoNombreProducto: "La Criolla",
    nuevoNombreVariante: "Clásica Natural",
  },
  {
    productoId: 132,
    varianteId: 116,
    nuevoNombreProducto: "La Pampeana",
    nuevoNombreVariante: "Curada Artesanal",
  },
  {
    productoId: 121,
    varianteId: 105,
    nuevoNombreProducto: "La Serrana",
    nuevoNombreVariante: "Boca Ancha",
  },
  {
    productoId: 123,
    varianteId: 107,
    nuevoNombreProducto: "La Campera",
    nuevoNombreVariante: "Forma Grande",
  },

  // --- MADERA ---
  {
    productoId: 138,
    varianteId: 122,
    nuevoNombreProducto: "El Quebracho",
    nuevoNombreVariante: "Madera Maciza",
  },
  {
    productoId: 136,
    varianteId: 120,
    nuevoNombreProducto: "El Rústico",
    nuevoNombreVariante: "Madera Tallada",
  },

  // --- VIDRIO ---
  {
    productoId: 135,
    varianteId: 119,
    nuevoNombreProducto: "El Transparente",
    nuevoNombreVariante: "Vidrio Borosilicato",
  },

  // --- COMBOS ---
  {
    productoId: 134,
    varianteId: 118,
    nuevoNombreProducto: "Dúo Esencial",
    nuevoNombreVariante: "Mate + Bombilla",
  },
  {
    productoId: 129,
    varianteId: 113,
    nuevoNombreProducto: "Kit Matero Completo",
    nuevoNombreVariante: "Mate + Bombilla + Bolso",
  },
  {
    productoId: 131,
    varianteId: 115,
    nuevoNombreProducto: "Kit Matero Premium",
    nuevoNombreVariante: "Mate + Bombilla + Bolso Cuero",
  },
];

const updateProducto = db.prepare("UPDATE productos SET nombre = ? WHERE id = ?");

// Las variantes están en la tabla de componentes - necesitamos encontrar el nombre correcto de la tabla
const tablas = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%variante%'").all();
console.log("Tablas variantes:", tablas.map(t => t.name));

// En Strapi v5 los componentes se guardan en tablas con prefijo
const tablaVariante = "inventario_variantes_components"; // nombre típico de Strapi
let varianteTable = null;

// Buscar la tabla correcta
const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
for (const t of allTables) {
  if (t.name.toLowerCase().includes("variante")) {
    console.log("Posible tabla variante:", t.name);
    varianteTable = t.name;
  }
}

// Ver columnas de inventario_variantes_components
if (varianteTable) {
  const cols = db.prepare(`PRAGMA table_info(${varianteTable})`).all();
  console.log(`\nColumnas de ${varianteTable}:`, cols.map(c => c.name));
}

let actualizados = 0;
for (const item of ACTUALIZACIONES) {
  updateProducto.run(item.nuevoNombreProducto, item.productoId);
  console.log(`  ✅ Producto [${item.productoId}]: "${item.nuevoNombreProducto}" | Variante: "${item.nuevoNombreVariante}"`);
  actualizados++;
}

// Intentar actualizar variantes
if (varianteTable) {
  const updateVariante = db.prepare(`UPDATE ${varianteTable} SET nombre = ? WHERE id = ?`);
  for (const item of ACTUALIZACIONES) {
    try {
      updateVariante.run(item.nuevoNombreVariante, item.varianteId);
      console.log(`     └─ Variante [${item.varianteId}] → "${item.nuevoNombreVariante}"`);
    } catch (e) {
      console.log(`     └─ ⚠️ No se pudo actualizar variante ${item.varianteId}: ${e.message}`);
    }
  }
}

db.close();
console.log(`\n🎉 ¡${actualizados} productos actualizados!`);
