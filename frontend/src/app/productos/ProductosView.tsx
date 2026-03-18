// src/app/productos/ProductosView.tsx
"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

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
  { label: "Blanco", value: "blanco", dotClass: "bg-white border border-gray-300" },
  { label: "Negro", value: "negro", dotClass: "bg-black" },
  { label: "Gris", value: "gris", dotClass: "bg-gray-500" },
  { label: "Marrón", value: "marron", dotClass: "bg-[#964B00]" },
  { label: "Bordo", value: "bordo", dotClass: "bg-[#8B0000]" },
];

type OrdenPrecio = "asc" | "desc" | null;

// ================== COMPONENTE ==================

export default function ProductosView({ productos }: { productos: any[] }) {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [combo, setCombo] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [ordenPrecio, setOrdenPrecio] = useState<OrdenPrecio>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  // ✨ NUEVO ESTADO PARA PROMOCIONES
  const [soloPromociones, setSoloPromociones] = useState<boolean>(false);

  // ================== FILTRADO + ORDEN ==================
  const productosProcesados = useMemo(() => {
    let resultado = productos.filter((p) => {
      // 1. Filtro por Buscador (Nombre)
      if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }

      // 2. Filtro por Categoría
      if (categoria && p.categoria?.nombre !== categoria) return false;

      // 3. Filtro por Combo
      if (combo && p.combo !== combo) return false;

      // 4. Filtro por Color
      if (color && p.color !== color) return false;

      // ✨ 5. FILTRO DE PROMOCIONES
      if (soloPromociones && !p.en_promocion) return false;

      return true;
    });

    // Ordenamiento dinámico (considerando precio de oferta si existe)
    if (ordenPrecio === "asc") {
      resultado = [...resultado].sort((a, b) => {
        const precioA = a.en_promocion ? a.precio_oferta : a.precioBase;
        const precioB = b.en_promocion ? b.precio_oferta : b.precioBase;
        return precioA - precioB;
      });
    } else if (ordenPrecio === "desc") {
      resultado = [...resultado].sort((a, b) => {
        const precioA = a.en_promocion ? a.precio_oferta : a.precioBase;
        const precioB = b.en_promocion ? b.precio_oferta : b.precioBase;
        return precioB - precioA;
      });
    }

    return resultado;
  }, [productos, categoria, combo, color, ordenPrecio, busqueda, soloPromociones]);

  // Función para resetear todos los filtros
  const limpiarFiltros = () => {
    setCategoria(null);
    setCombo(null);
    setColor(null);
    setBusqueda("");
    setOrdenPrecio(null);
    setSoloPromociones(false);
  };

  return (
    <main className="w-full bg-[#F4F1EB] min-h-screen font-sans text-[#5C5149]">
      <section className="mx-auto max-w-[1400px] px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* ================= SIDEBAR (Filtros) ================= */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-8">

            <div>
              <h2 className="text-3xl font-bold text-[#5C5149] mb-4">Productos</h2>
              <button
                onClick={limpiarFiltros}
                className="text-sm text-[#5C5149]/60 hover:text-[#486837] underline decoration-transparent hover:decoration-current transition-all"
              >
                Limpiar filtros
              </button>
            </div>

            {/* ✨ SWITCH DE PROMOCIONES (Diseño Destacado) */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-[#E0DCD3]">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-bold text-[#5C5149] group-hover:text-red-600 transition-colors">
                  Solo Ofertas 🔥
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={soloPromociones}
                    onChange={(e) => setSoloPromociones(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${soloPromociones ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soloPromociones ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            {/* --- BUSCADOR --- */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar mate..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-white border border-[#E0DCD3] rounded-lg px-4 py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-[#5C5149]/20 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5149]/50"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* --- CATEGORÍAS --- */}
            <div>
              <h3 className="text-lg font-bold mb-3 border-b border-[#E0DCD3] pb-1">Categorías</h3>
              <ul className="space-y-2">
                {CATEGORIAS.map((c) => {
                  const active = categoria === c.value;
                  return (
                    <li key={c.label}>
                      <button
                        type="button"
                        onClick={() => setCategoria(active ? null : c.value)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${active
                          ? "bg-[#5C5149] text-white font-medium shadow-sm"
                          : "text-[#5C5149]/80 hover:bg-[#E0DCD3]/50"
                          }`}
                      >
                        {c.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* --- COMBOS --- */}
            <div>
              <h3 className="text-lg font-bold mb-3 border-b border-[#E0DCD3] pb-1">Combos</h3>
              <ul className="space-y-2">
                {COMBOS.map((c) => {
                  const active = combo === c.value;
                  return (
                    <li key={c.label}>
                      <button
                        type="button"
                        onClick={() => setCombo(active ? null : c.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${active
                          ? "bg-[#5C5149]/10 text-[#5C5149] font-bold border border-[#5C5149]/20"
                          : "text-[#5C5149]/70 hover:text-[#5C5149] hover:bg-[#E0DCD3]/30"
                          }`}
                      >
                        {c.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* --- COLORES --- */}
            <div>
              <h3 className="text-lg font-bold mb-3 border-b border-[#E0DCD3] pb-1">Color</h3>
              <ul className="space-y-2">
                {COLORES.map((c) => {
                  const active = color === c.value;
                  return (
                    <li
                      key={c.label}
                      onClick={() => setColor(active ? null : c.value)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all ${active ? "bg-white shadow-sm ring-1 ring-[#5C5149]/10" : "hover:bg-[#E0DCD3]/30"
                        }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full shadow-sm ${c.dotClass} ${active ? "ring-2 ring-offset-2 ring-[#5C5149]" : ""}`}
                      />
                      <span className={`text-sm ${active ? "font-semibold text-[#5C5149]" : "text-[#5C5149]/80"}`}>
                        {c.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* ================= CONTENIDO PRINCIPAL ================= */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-[#5C5149]/60 text-sm">
              Mostrando <span className="font-bold text-[#5C5149]">{productosProcesados.length}</span> productos
            </p>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#5C5149] whitespace-nowrap">Ordenar por:</span>
              <div className="relative">
                <select
                  value={ordenPrecio ?? ""}
                  onChange={(e) => setOrdenPrecio(e.target.value === "" ? null : (e.target.value as OrdenPrecio))}
                  className="appearance-none bg-white border border-[#E0DCD3] rounded-lg pl-4 pr-10 py-2 text-sm text-[#5C5149] focus:outline-none focus:ring-2 focus:ring-[#5C5149]/20 cursor-pointer shadow-sm"
                >
                  <option value="">Por defecto</option>
                  <option value="asc">Precio: Menor a mayor</option>
                  <option value="desc">Precio: Mayor a menor</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5149]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {productosProcesados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {productosProcesados.map((p: any) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-xl border border-dashed border-[#E0DCD3]">
              <p className="text-lg font-medium text-[#5C5149] mb-2">No encontramos mates con esos filtros.</p>
              <button
                onClick={limpiarFiltros}
                className="mt-6 px-6 py-2 bg-[#5C5149] text-white rounded-lg hover:bg-[#4a413a] transition-colors text-sm font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}