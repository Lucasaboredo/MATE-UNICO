"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types/product";

const STRAPI_URL = "http://127.0.0.1:1337";
const FAVORITES_KEY = "favorites";
const ULTIMAS_UNIDADES_UMBRAL = 5;

interface Props {
  producto: Producto;
}

export default function ProductCard({ producto }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const favs = raw ? JSON.parse(raw) : [];
    setIsFav(favs.some((p: any) => Number(p.id) === Number(producto.id)));
  }, [producto.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const raw = localStorage.getItem(FAVORITES_KEY);
    let favs = raw ? JSON.parse(raw) : [];
    
    if (isFav) {
      favs = favs.filter((p: any) => Number(p.id) !== Number(producto.id));
      setIsFav(false);
    } else {
      const payload = {
        id: producto.id,
        nombre: producto.nombre,
        slug: producto.slug,
        precioBase: producto.precioBase,
        imagen: producto.imagen ?? [],
        variantes: producto.variantes ?? [],
        en_promocion: producto.en_promocion,
        precio_oferta: producto.precio_oferta
      };
      favs = [payload, ...favs];
      setIsFav(true);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-mate.jpg";
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  };

  const currentImageUrl = producto.imagen?.[currentImageIndex]
    ? getImageUrl(producto.imagen[currentImageIndex].url)
    : null;

  const totalStock = useMemo(() => {
    const vars = producto.variantes || [];
    return vars.reduce((acc, v) => acc + (Number(v?.stock) || 0), 0);
  }, [producto]);

  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < ULTIMAS_UNIDADES_UMBRAL;
  const tienePromo = !!(producto.en_promocion && producto.precio_oferta);
  const porcentaje = tienePromo ? Math.round(((producto.precioBase - (producto.precio_oferta || 0)) / producto.precioBase) * 100) : 0;

  return (
    <div className={`flex flex-col w-full max-w-[280px] bg-[#5C5149] rounded-2xl p-4 shadow-lg transition-all duration-300 group ${isOutOfStock ? "opacity-75" : "hover:-translate-y-2"}`}>
      
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
        {/* ✨ BOTÓN FAVORITOS MÁS CHICO */}
        <button
          onClick={toggleFavorite}
          className={`absolute z-30 right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${
            isFav 
              ? "bg-red-500/90 border-red-400 text-white scale-110" 
              : "bg-white/20 border-white/30 text-white hover:bg-white/40"
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={isFav ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            strokeWidth="2.5" 
            stroke="currentColor" 
            className={`w-4 h-4 transition-transform duration-300 ${isFav ? "scale-110" : "group-hover:scale-110"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <Link href={`/productos/${producto.slug}`} className="block w-full h-full">
          {isOutOfStock && <div className="absolute z-10 left-3 top-3 px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded-full">Sin stock</div>}
          {!isOutOfStock && isLowStock && <div className="absolute z-10 left-3 top-3 px-3 py-1 bg-[#4A4A40] text-white text-[9px] font-black uppercase rounded-full">Últimas unidades</div>}
          {tienePromo && !isOutOfStock && <div className="absolute z-10 left-3 bottom-3 bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-black">{porcentaje}% OFF</div>}
          
          <div className={`relative w-full h-full ${isOutOfStock ? "grayscale opacity-50" : ""}`}>
            {currentImageUrl ? (
              <Image src={currentImageUrl} alt={producto.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-700 text-gray-400 text-[10px]">SIN IMAGEN</div>
            )}
          </div>
        </Link>
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-[18px] font-bold text-[#FCFAF6] leading-tight truncate">
          <Link href={`/productos/${producto.slug}`} className="hover:text-gray-300 transition-colors">{producto.nombre}</Link>
        </h2>
        <div className="mt-2 flex items-baseline gap-2 justify-center sm:justify-start">
          {tienePromo ? (
            <>
              <p className="text-[20px] font-black text-[#FCFAF6]">${producto.precio_oferta?.toLocaleString("es-AR")}</p>
              <p className="text-[13px] text-gray-400 line-through decoration-red-500/50">${producto.precioBase.toLocaleString("es-AR")}</p>
            </>
          ) : (
            <p className="text-[20px] font-bold text-[#FCFAF6]">${producto.precioBase.toLocaleString("es-AR")}</p>
          )}
        </div>
      </div>
    </div>
  );
}