"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SidebarFiltros({ categorias }: any) {
  const router = useRouter();
  const params = useSearchParams();

  const aplicarFiltro = (clave: string, valor: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set(clave, valor);
    router.push(`/productos?${newParams.toString()}`);
  };

  const limpiarFiltros = () => {
    router.push("/productos");
  };

  return (
    <aside className="w-64 bg-[#E8E1D6] p-6 rounded-xl h-fit sticky top-10 border border-[#ccbbaa]/40">

      {/* ---------- FILTROS ----------- */}
      <h2 className="text-2xl font-bold text-green-900 mb-6">Filtros</h2>

      {/* Categorías */}
      <h3 className="text-xl font-semibold text-green-900 mb-3">Categorías</h3>
      <ul className="space-y-2 mb-6">
        {categorias.map((c: any) => (
          <li
            key={c.id}
            onClick={() => aplicarFiltro("categoria", c.nombre)}
            className="cursor-pointer hover:text-green-700 transition"
          >
            {c.nombre}
          </li>
        ))}
      </ul>

      {/* Combos */}
      <h3 className="text-xl font-semibold text-green-900 mb-3">Combos</h3>
      <ul className="space-y-2 mb-6">
        <li onClick={() => aplicarFiltro("combo", "solo mate")} className="cursor-pointer hover:text-green-700">Mate</li>
        <li onClick={() => aplicarFiltro("combo", "mate + bombilla")} className="cursor-pointer hover:text-green-700">Mate + bombilla</li>
        <li onClick={() => aplicarFiltro("combo", "mate + bombilla + bolso")} className="cursor-pointer hover:text-green-700">Mate + bombilla + bolso</li>
      </ul>

      {/* Color */}
      <h3 className="text-xl font-semibold text-green-900 mb-3">Color</h3>

      <ul className="space-y-2 mb-6">
        {["blanco", "negro", "gris", "rojo", "bordo"].map((color) => (
          <li
            key={color}
            onClick={() => aplicarFiltro("color", color)}
            className="cursor-pointer flex items-center gap-2 hover:text-green-700"
          >
            <span
              className="inline-block w-3 h-3 rounded-full border"
              style={{ backgroundColor: color }}
            ></span>
            {color}
          </li>
        ))}
      </ul>

      {/* ORDENAR POR PRECIO */}
      <h3 className="text-xl font-semibold text-green-900 mb-3">Ordenar por</h3>

      <select
        className="w-full p-2 rounded border"
        onChange={(e) => aplicarFiltro("orden", e.target.value)}
        defaultValue={params.get("orden") ?? ""}
      >
        <option value="">Por defecto</option>
        <option value="precio_asc">Precio (menor a mayor)</option>
        <option value="precio_desc">Precio (mayor a menor)</option>
      </select>

      {/* LIMPIAR FILTROS */}
      <button
        onClick={limpiarFiltros}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Limpiar filtros
      </button>

    </aside>
  );
}
