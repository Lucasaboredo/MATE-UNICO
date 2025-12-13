"use client";

import { useMemo, useState } from "react";
import { ProductoCard } from "@/components/ProductoCard";

// ================== CONSTANTES ==================

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
  { label: "Marrón", value: "marrón", dotClass: "bg-[#964B00]" },
  { label: "Bordo", value: "bordo", dotClass: "bg-[#8B0000]" },
];

type OrdenPrecio = "asc" | "desc" | null;

// ================== COMPONENTE ==================

export default function ProductosView({ productos }: { productos: any[] }) {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [combo, setCombo] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [ordenPrecio, setOrdenPrecio] = useState<OrdenPrecio>(null);

  // ================== FILTRADO + ORDEN ==================
  const productosProcesados = useMemo(() => {
    let resultado = productos.filter((p) => {
      if (categoria && p.categoria?.nombre !== categoria) return false;
      if (combo && p.combo !== combo) return false;
      if (color && p.color !== color) return false;
      return true;
    });

    if (ordenPrecio === "asc") {
      resultado = [...resultado].sort(
        (a, b) => a.precioBase - b.precioBase
      );
    }

    if (ordenPrecio === "desc") {
      resultado = [...resultado].sort(
        (a, b) => b.precioBase - a.precioBase
      );
    }

    return resultado;
  }, [productos, categoria, combo, color, ordenPrecio]);

  return (
    <main className="w-full bg-[#F4F1EB] min-h-screen">
      <section className="mx-auto max-w-[1400px] px-6 py-12 flex gap-12">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 pr-8 border-r border-[#E0DCD3] select-none">
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
                      onClick={() => setCategoria(active ? null : c.value)}
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
                      onClick={() => setCombo(active ? null : c.value)}
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
                    onClick={() => setColor(active ? null : c.value)}
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
            </ul>
          </div>
        </aside>

        {/* ================= CONTENIDO ================= */}
        <div className="flex-1">

          {/* ORDENAR ARRIBA DERECHA */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#5C5149]">
                Ordenar por:
              </span>
              <select
                value={ordenPrecio ?? ""}
                onChange={(e) =>
                  setOrdenPrecio(
                    e.target.value === ""
                      ? null
                      : (e.target.value as OrdenPrecio)
                  )
                }
                className="border border-[#E0DCD3] rounded-md px-3 py-1.5 text-sm bg-white text-[#5C5149] focus:outline-none focus:ring-2 focus:ring-[#486837]/40"
              >
                <option value="">Sin ordenar</option>
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {productosProcesados.map((p: any) => (
              <ProductoCard key={p.id} producto={p} />
            ))}

            {productosProcesados.length === 0 && (
              <p className="text-[#5C5149]/70 col-span-full">
                No hay productos que coincidan con los filtros seleccionados.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
