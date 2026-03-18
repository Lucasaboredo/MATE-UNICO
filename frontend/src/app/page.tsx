"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromStrapi } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";

const FAVORITES_KEY = "mate-unico:favorites";

export default function Home() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [promociones, setPromociones] = useState<any[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);

  useEffect(() => {
    async function load() {
      // HERO
      setLoadingHero(true);
      try {
        const homeRes = await fetchFromStrapi("/api/homes?populate[imagen_hero]=true");
        setSlides(homeRes.data || []);
      } catch (e) {
        console.error("⚠️ Error Hero:", e);
      } finally {
        setLoadingHero(false);
      }

      // DESTACADOS
      setLoadingDestacados(true);
      try {
        const prodRes = await fetchFromStrapi(
          "/api/productos?filters[destacado][$eq]=true&populate=imagen&populate=variantes"
        );
        setProductosDestacados(prodRes.data || []);
      } catch (e) {
        console.error("⚠️ Error destacados:", e);
      } finally {
        setLoadingDestacados(false);
      }

      // PROMOCIONES
      setLoadingPromos(true);
      try {
        const promosRes = await fetchFromStrapi(
          "/api/productos?filters[en_promocion][$eq]=true&populate=imagen&populate=variantes"
        );
        setPromociones(promosRes.data || []);
      } catch (e) {
        console.error("⚠️ Error promociones:", e);
      } finally {
        setLoadingPromos(false);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#FCFAF6]">
      {/* HERO SECTION */}
      {!loadingHero && slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <div className="w-full h-[400px] bg-[#E5E0D8] flex items-center justify-center text-[#5C5149]">
          <p className="text-xl font-medium tracking-widest uppercase">Mate Único</p>
        </div>
      )}

      {/* ================= SECCIÓN PROMOCIONES 🔥 ================= */}
      <section className="w-full py-20 bg-[#FAF7F2] border-b border-[#E5E0D8]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#2F4A2D] tracking-tighter mb-4 uppercase text-center">
              Promociones 🔥
            </h2>
            <div className="h-1 w-20 bg-[#2F4A2D] rounded-full mb-6"></div>
            <p className="text-[#5C5149] font-medium text-sm max-w-md text-center">
              Aprovechá nuestros precios exclusivos por tiempo limitado.
            </p>
          </div>

          {loadingPromos ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse text-[#2F4A2D] font-bold text-center">Buscando ofertas...</div>
            </div>
          ) : promociones.length > 0 ? (
            /* ✨ AJUSTE: Mismo grid y centrado que Destacados */
            <div className="flex flex-wrap justify-center gap-8">
              {promociones.map((prod: any) => (
                <div key={`promo-${prod.id}`} className="w-full max-w-[280px] flex justify-center">
                  <ProductCard producto={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto py-10 bg-white/50 rounded-3xl border-2 border-dashed border-[#E5E0D8] text-center">
              <p className="text-[#5C5149] italic text-sm font-medium text-center">Próximamente nuevas promociones...</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= SECCIÓN DESTACADOS ✨ ================= */}
      <section className="w-full py-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 uppercase tracking-tight text-center">
              Nuestros Destacados
            </h2>
            <div className="h-1 w-12 bg-[#4A4A40] mb-6"></div>
            <p className="text-gray-500 max-w-lg text-sm leading-relaxed text-center">
              La calidad que nos define en cada pieza.
            </p>
          </div>

          {loadingDestacados ? (
            <div className="text-center py-10 text-gray-400 animate-pulse">Cargando destacados...</div>
          ) : productosDestacados.length > 0 ? (
            /* ✨ flex-wrap hace que se apilen hacia abajo si o si en mobile pero manteniendo 4 por fila en compu */
            <div className="flex flex-wrap justify-center gap-8">
              {productosDestacados.map((prod: any) => (
                <div key={`dest-${prod.id}`} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[280px] flex justify-center">
                  <ProductCard producto={prod} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 italic">No hay productos destacados hoy.</p>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/productos"
              className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-[#4A4A40] rounded-full hover:bg-[#2F4A2D] shadow-lg active:scale-95"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Ver Toda la Tienda</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}