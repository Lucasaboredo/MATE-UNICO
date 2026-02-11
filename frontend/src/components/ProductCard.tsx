"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types/product";

const STRAPI_URL = "http://127.0.0.1:1337";

interface Props {
  producto: Producto;
}

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

  return (
    <div
      className="
        flex flex-col
        w-full max-w-[360px]
        bg-[#5C5149]
        rounded-2xl
        p-4
        shadow-[0_8px_20px_rgba(0,0,0,0.25)]
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)]
        group
      "
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
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt={producto.nombre}
            fill
            className="
              object-cover
              transition-transform duration-500 ease-in-out
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            Sin Foto
          </div>
        )}
      </Link>

      {/* SWATCHES (Selectores de color) */}
      {producto.variantes && producto.variantes.some(v => v.codigo_color) && (
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
                  className="
                    w-4 h-4 rounded-full
                    border border-white
                    shadow-sm
                    hover:scale-125
                    transition-transform
                  "
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