"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types/product";

const STRAPI_URL = "http://127.0.0.1:1337";

interface Props {
  producto: Producto;
}

// ✅ Umbral para “Últimas unidades”
const ULTIMAS_UNIDADES_UMBRAL = 5;

export default function ProductCard({ producto }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-mate.jpg";
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  };

  const currentImageUrl =
    producto.imagen && producto.imagen[currentImageIndex]
      ? getImageUrl(producto.imagen[currentImageIndex].url)
      : null;

  // ✅ STOCK (sumamos stock de variantes)
  const totalStock = useMemo(() => {
    const vars: any[] = (producto as any)?.variantes || [];
    if (!Array.isArray(vars) || vars.length === 0) return 0;
    return vars.reduce((acc, v) => acc + (Number(v?.stock) || 0), 0);
  }, [producto]);

  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < ULTIMAS_UNIDADES_UMBRAL;

  const badgeText = isOutOfStock ? "Sin stock" : isLowStock ? "Últimas unidades" : null;

  return (
    <div
      className={`
        flex flex-col
        w-full max-w-[360px]
        bg-[#5C5149]
        rounded-2xl
        p-4
        shadow-[0_8px_20px_rgba(0,0,0,0.25)]
        transition-all duration-200
        group
        ${isOutOfStock ? "opacity-75" : "hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)]"}
      `}
    >
      {/* IMAGEN */}
      <Link
        href={`/productos/${producto.slug}`}
        className="
          relative w-full aspect-square
          mb-4
          rounded-xl
          overflow-hidden
          block
        "
      >
        {/* ✅ BADGE */}
        {badgeText && (
          <div
            className={`
              absolute z-10 left-3 top-3
              px-3 py-1.5
              rounded-full
              text-[10px] font-bold
              uppercase tracking-wider
              shadow-sm border
              ${isOutOfStock ? "bg-red-600 text-white border-red-700" : "bg-[#4A4A40] text-white border-[#3E3E35]"}
            `}
          >
            {badgeText}
          </div>
        )}

        <div className={`relative w-full h-full ${isOutOfStock ? "grayscale opacity-60" : ""}`}>
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt={producto.nombre}
              fill
              className={`
                object-cover
                transition-transform duration-500 ease-in-out
                ${isOutOfStock ? "" : "group-hover:scale-105"}
              `}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Sin Foto
            </div>
          )}
        </div>
      </Link>

      {/* SWATCHES (Selectores de color) */}
      {producto.variantes && producto.variantes.some((v) => v.codigo_color) && (
        <div className="flex gap-2 mb-3 justify-center">
          {producto.variantes.map(
            (variant) =>
              variant.codigo_color && (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      variant.indice_imagen !== undefined &&
                      producto.imagen?.[variant.indice_imagen]
                    ) {
                      setCurrentImageIndex(variant.indice_imagen);
                    }
                  }}
                  className={`
                    w-4 h-4 rounded-full
                    border border-white
                    shadow-sm
                    transition-transform
                    ${isOutOfStock ? "opacity-60" : "hover:scale-125"}
                  `}
                  style={{ backgroundColor: variant.codigo_color }}
                  title={variant.nombre}
                />
              )
          )}
        </div>
      )}

      {/* INFO */}
      <div className="px-1 text-center sm:text-left">
        <h2 className="text-[20px] font-semibold text-[#FCFAF6] leading-snug">
          <Link
            href={`/productos/${producto.slug}`}
            className="hover:underline underline-offset-4"
          >
            {producto.nombre}
          </Link>
        </h2>

        <p className="mt-1 text-[22px] font-medium text-[#FCFAF6]">
          ${(producto.precioBase || 0).toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}