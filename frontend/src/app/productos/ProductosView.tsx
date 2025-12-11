"use client";

import { useMemo, useState } from "react";
import { ProductoCard } from "@/components/ProductoCard";

// Opciones de filtros (lo que ve el usuario vs lo que guarda Strapi)
const CATEGORIAS = [
  { label: "Todas", value: null },
  { label: "Calabaza", value: "Calabaza" },
  { label: "Vidrio", value: "Vidrio" },
  { label: "Metal", value: "Metal" },
  { label: "Madera", value: "Madera" },
];

const COMBOS = [
  { label: "Mate", value: "mate" },
  { label: "Mate + bombilla", value: "mate_bombilla" },
  { label: "Mate + bombilla + bolso", value: "mate_bombilla_bolso" },
];

const COLORES = [
  { label: "Blanco", value: "blanco", dotClass: "bg-white border border-[#ccc]" },
  { label: "Negro", value: "negro", dotClass: "bg-black" },
  { label: "Gris", value: "gris", dotClass: "bg-gray-500" },
  { label: "Rojo", value: "rojo", dotClass: "bg-red-600" },
  { label: "Bordo", value: "bordo", dotClass: "bg-[#8B0000]" },
];

export default function ProductosView({ productos }: { productos: any[] }) {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [combo, setCombo] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  // FILTRADO
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      if (categoria && p.categoria?.nombre !== categoria) return false;
      if (combo && p.combo !== combo) return false;
      if (color && p.color !== color) return false;
      return true;
    });
  }, [productos, categoria, combo, color]);

  return (
    <main className="w-full bg-[#F4F1EB] min-h-screen">
      <section className="mx-auto max-w-[1400px] px-6 py-12 flex gap-12">

        {/* =============== SIDEBAR =============== */}
        <aside className="w-64 pr-8 border-r border-[#E0DCD3] relative z-20 select-none">
          <h2 className="text-[42px] font-bold text-[#5C5149] mb-6">
            Producto
          </h2>

          {/* Categorías */}
          <div className="mb-10">
            <p className="text-[#5C5149] font-semibold mb-2">Categorías</p>
            <ul className="space-y-1">
              {CATEGORIAS.map((c) => {
                const active = categoria === c.value;
                return (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => setCategoria(c.value)}
                      className={`cursor-pointer text-left ${
                        active
                          ? "text-[#5C5149] font-semibold"
                          : "text-[#5C5149]/70 hover:text-[#5C5149]"
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Combos */}
          <div className="mb-10">
            <p className="text-[#5C5149] font-semibold mb-2">Combos</p>
            <ul className="space-y-1 text-[#5C5149]/70 italic">
              {COMBOS.map((c) => {
                const active = combo === c.value;
                return (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => setCombo(c.value)}
                      className={`cursor-pointer text-left ${
                        active
                          ? "text-[#5C5149] font-semibold not-italic"
                          : "hover:text-[#5C5149]"
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}

              {/* Botón para limpiar combo */}
              <li>
                <button
                  type="button"
                  onClick={() => setCombo(null)}
                  className="mt-2 text-xs text-[#5C5149]/60 hover:text-[#5C5149]"
                >
                  Limpiar combos
                </button>
              </li>
            </ul>
          </div>

          {/* Colores */}
          <div>
            <p className="text-[#5C5149] font-semibold mb-2">
              Filtrar por<br />Color
            </p>

            <ul className="space-y-2 text-[#5C5149]">
              {COLORES.map((c) => {
                const active = color === c.value;
                return (
                  <li
                    key={c.label}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setColor(c.value)}
                  >
                    <span
                      className={
                        "w-3 h-3 rounded-full " +
                        c.dotClass +
                        (active ? " ring-2 ring-[#5C5149]" : "")
                      }
                    />
                    <span
                      className={
                        active
                          ? "font-semibold"
                          : "text-[#5C5149]/80 hover:text-[#5C5149]"
                      }
                    >
                      {c.label}
                    </span>
                  </li>
                );
              })}

              {/* limpiar color */}
              <li>
                <button
                  type="button"
                  onClick={() => setColor(null)}
                  className="mt-2 text-xs text-[#5C5149]/60 hover:text-[#5C5149]"
                >
                  Limpiar color
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* =============== GRID PRODUCTOS =============== */}
        <div className="flex-1 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {productosFiltrados.map((p: any) => (
              <ProductoCard key={p.id} producto={p} />
            ))}

            {productosFiltrados.length === 0 && (
              <p className="text-[#5C5149]/70">
                No hay productos que coincidan con los filtros seleccionados.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
