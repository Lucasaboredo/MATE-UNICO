/**
 * Script para actualizar las descripciones de los productos en la BD SQLite.
 * Ejecutar con: node fix-descriptions.js
 */

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, ".tmp", "data.db");
const db = new Database(dbPath);

const DESCRIPCIONES = [
  {
    id: 115,
    nombre: "mate metal 2",
    descripcion: "Mate de acero inoxidable con terminación pulida y detalles modernos. Ideal para quienes buscan durabilidad sin perder estilo. Conserva la temperatura de la infusión por más tiempo gracias a su construcción robusta. No absorbe olores ni sabores.",
  },
  {
    id: 121,
    nombre: "calabaza 3",
    descripcion: "Mate de calabaza curado artesanalmente, con boca ancha y base firme. Su interior natural potencia el sabor de la yerba y mejora con cada uso. Cada pieza es única, con tonos y texturas que varían según el proceso de curado. Incluye boquilla de metal.",
  },
  {
    id: 123,
    nombre: "calabaza 4",
    descripcion: "Mate de calabaza de tamaño generoso, perfecto para los que prefieren una cebada abundante. Curado a mano en procesos artesanales que resaltan los aromas naturales de la yerba. Su forma ergonómica facilita el agarre y la comodidad durante el mate.",
  },
  {
    id: 129,
    nombre: "bolso + bombilla + mate 1",
    descripcion: "Combo completo listo para llevar a cualquier lado: mate de calabaza, bombilla de acero inoxidable filtro tulipa y bolso térmico porta-mate. Un regalo ideal o el kit perfecto para empezar a matear. Todo combinado en un solo packaging.",
  },
  {
    id: 131,
    nombre: "bolso + bombilla + mate 2",
    descripcion: "Kit matero premium que incluye mate artesanal, bombilla con filtro reforzado y bolso térmico de cuero sintético. Diseñado para el mateador que viaja sin dejar el ritual atrás. Los tres elementos se complementan en diseño y funcionalidad.",
  },
  {
    id: 132,
    nombre: "calabaza 2",
    descripcion: "Mate de calabaza clásico con forma redondeada y boca ajustada, perfecta para una buena cebada. Curado con grasa y lista para usar. Con el uso adquiere un sabor cada vez más especial. Una opción tradicional para los amantes del mate genuino.",
  },
  {
    id: 133,
    nombre: "MATE METAL 1",
    descripcion: "Mate de acero inoxidable con diseño cilíndrico elegante y acabado mate opaco. Resistente a golpes y fácil de limpiar. No requiere curado ni mantenimiento especial. Perfecto para el uso diario tanto en casa como en la oficina o al aire libre.",
  },
  {
    id: 134,
    nombre: "combo mate bombilla",
    descripcion: "Combo esencial para empezar bien el día: mate artesanal y bombilla de acero inoxidable con filtro de calidad. El dúo perfecto para el que quiere comenzar en el ritual del mate sin complicaciones. Práctico, funcional y con excelente relación precio-valor.",
  },
  {
    id: 135,
    nombre: "vidrio 1",
    descripcion: "Mate de vidrio borosilicato resistente al calor, con base de silicona antideslizante y aro de acero inoxidable. Permite ver el nivel de la yerba y la infusión en todo momento. Moderno, higiénico y 100% libre de sabores residuales. Apto para lavavajillas.",
  },
  {
    id: 136,
    nombre: "MATE MADERA 2",
    descripcion: "Mate tallado en madera dura seleccionada, con interior laqueado para proteger y potenciar el sabor de la yerba. Su acabado natural hace que cada pieza sea irrepetible. Liviano, cálido al tacto y con una estética rústica que invita a la calma del matecito.",
  },
  {
    id: 137,
    nombre: "calabaza 1",
    descripcion: "Mate de calabaza pequeño y liviano, ideal para manos chicas o para tomar el primer mate del día. Curado artesanalmente para una experiencia auténtica desde el primer uso. Su forma compacta lo hace fácil de guardar y transportar. Un clásico que nunca falla.",
  },
  {
    id: 138,
    nombre: "MATE MADERA 1",
    descripcion: "Mate elaborado en madera maciza con interior tratado para garantizar durabilidad e higiene. Su textura natural y diseño rústico lo convierten en una pieza de colección. Con el tiempo, la madera absorbe el aroma de la yerba mejorando la experiencia en cada mate.",
  },
];

const update = db.prepare("UPDATE productos SET descripcion = ? WHERE id = ?");

let actualizados = 0;

for (const p of DESCRIPCIONES) {
  update.run(p.descripcion, p.id);
  console.log(`  ✅ [${p.id}] ${p.nombre}`);
  actualizados++;
}

db.close();
console.log(`\n🎉 ¡${actualizados} descripciones actualizadas exitosamente!`);
