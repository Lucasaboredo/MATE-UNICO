"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  onFiltrarPromocion: (soloPromos: boolean) => void;
  soloPromociones: boolean;
}

export default function FiltrosCatalogo({ onFiltrarPromocion, soloPromociones }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filtrar = (tipo: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(tipo, valor);
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-green-900">Producto</h2>

      {/* ✨ SECCIÓN DE PROMOCIONES */}
      <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="font-bold text-red-700 group-hover:text-red-800 transition-colors">
            Solo Ofertas 🔥
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={soloPromociones}
              onChange={(e) => onFiltrarPromocion(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${soloPromociones ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soloPromociones ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* Categorías */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 border-b pb-1">Categorías</h3>
        <ul className="text-sm mt-2 space-y-1">
          {["Calabaza", "Vidrio", "Metal", "Madera"].map(c => (
            <li
              key={c}
              onClick={() => filtrar("categoria", c)}
              className="cursor-pointer hover:text-black hover:translate-x-1 transition-transform"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Combos */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 border-b pb-1">Combos</h3>
        <ul className="text-sm mt-2 space-y-1">
          <li onClick={() => filtrar("combo", "mate-bombilla")} className="cursor-pointer hover:text-black">
            Mate + bombilla
          </li>
          <li onClick={() => filtrar("combo", "mate-bombilla-bolso")} className="cursor-pointer hover:text-black">
            Mate + bombilla + bolso
          </li>
        </ul>
      </div>

      {/* Colores */}
      <div>
        <h3 className="font-semibold text-gray-900 border-b pb-1">Filtrar por Color</h3>
        <ul className="text-sm mt-2 space-y-2">
          {[
            { name: "Blanco", color: "white" },
            { name: "Negro", color: "black" },
            { name: "Gris", color: "gray" },
            { name: "Rojo", color: "red" },
            { name: "Bordo", color: "#7a0019" },
          ].map((c) => (
            <li
              key={c.name}
              onClick={() => filtrar("color", c.name)}
              className="flex items-center cursor-pointer hover:translate-x-1 transition-transform"
            >
              <span
                className="w-3 h-3 rounded-full mr-2 border border-gray-200"
                style={{ backgroundColor: c.color }}
              ></span>
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}