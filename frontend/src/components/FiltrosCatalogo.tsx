"use client";

import { useRouter } from "next/navigation";

export default function FiltrosCatalogo() {
  const router = useRouter();

  const filtrar = (tipo: string, valor: string) => {
    router.push(`/productos?${tipo}=${valor}`);
  };

  return (
    <div className="text-gray-700">

      <h2 className="text-3xl font-bold mb-6 text-green-900">Producto</h2>

      {/* Categorías */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900">Categorías</h3>
        <ul className="text-sm mt-2 space-y-1">
          {["Calabaza", "Vidrio", "Metal", "Madera"].map(c => (
            <li
              key={c}
              onClick={() => filtrar("categoria", c)}
              className="cursor-pointer hover:text-black"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Combos */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900">Combos</h3>
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
        <h3 className="font-semibold text-gray-900">Filtrar por Color</h3>

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
              className="flex items-center cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
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
