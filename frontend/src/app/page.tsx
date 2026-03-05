// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchFromStrapi } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";

const FAVORITES_KEY = "mate-unico:favorites";

function buildInFilterQuery(paramBase: string, values: string[]) {
  // Ej: filters[slug][$in][0]=a&filters[slug][$in][1]=b
  return values
    .map((v, i) => `${paramBase}[${i}]=${encodeURIComponent(v)}`)
    .join("&");
}

export default function Home() {
  // HERO
  const [slides, setSlides] = useState<any[]>([]);
  const [loadingHero, setLoadingHero] = useState(true);

  // DESTACADOS
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);

  // PROMOCIONES
  const [promociones, setPromociones] = useState<any[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);

  // FAVORITOS (slugs guardados)
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // 1) Cargar favoritos desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const slugs = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      setFavoriteSlugs(slugs);
    } catch {
      setFavoriteSlugs([]);
    } finally {
      setLoadingFavs(false);
    }
  }, []);

  // 2) Cargar Hero + Destacados + Promos (Strapi)
  useEffect(() => {
    async function load() {
      // HERO
      setLoadingHero(true);
      try {
        const homeRes = await fetchFromStrapi("/api/homes?populate[imagen_hero]=true");
        setSlides(homeRes.data || []);
      } catch (e) {
        console.error("⚠️ Error cargando el Hero:", e);
        setSlides([]);
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
        console.error("⚠️ Error cargando productos destacados:", e);
        setProductosDestacados([]);
      } finally {
        setLoadingDestacados(false);
      }

      // PROMOCIONES / OFERTAS
      // Soporta dos escenarios típicos:
      // - campo "descuento" (number) > 0
      // - campo "precioOferta" (number) not null
      setLoadingPromos(true);
      try {
        const promosRes = await fetchFromStrapi(
          "/api/productos?" +
            [
              "populate=imagen",
              "populate=variantes",
              // OR: descuento > 0  ||  precioOferta not null
              "filters[$or][0][descuento][$gt]=0",
              "filters[$or][1][precioOferta][$notNull]=true",
            ].join("&")
        );
        setPromociones(promosRes.data || []);
      } catch (e) {
        console.error("⚠️ Error cargando promociones:", e);
        setPromociones([]);
      } finally {
        setLoadingPromos(false);
      }
    }

    load();
  }, []);

  // 3) Cargar productos favoritos (si hay slugs)
  useEffect(() => {
    async function loadFavs() {
      if (!favoriteSlugs || favoriteSlugs.length === 0) {
        setFavoritos([]);
        return;
      }

      try {
        const inQuery = buildInFilterQuery("filters[slug][$in]", favoriteSlugs);
        const url = `/api/productos?${inQuery}&populate=imagen&populate=variantes`;
        const res = await fetchFromStrapi(url);
        setFavoritos(res.data || []);
      } catch (e) {
        console.error("⚠️ Error cargando favoritos:", e);
        setFavoritos([]);
      }
    }

    loadFavs();
  }, [favoriteSlugs]);

  const hasFavs = useMemo(() => favoritos.length > 0, [favoritos]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ================= HERO ================= */}
      {!loadingHero && slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <div className="w-full h-[400px] bg-gray-200 flex flex-col items-center justify-center text-gray-500 gap-2">
          <p className="text-xl font-bold">Bienvenido a Mate Único</p>
          <p className="text-sm">
            (Carga imágenes en la colección &apos;Homes&apos; de Strapi para ver el banner)
          </p>
        </div>
      )}

      {/* ================= PROMOCIONES / OFERTAS ================= */}
      <section className="w-full bg-[#FAF7F2] py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <h2 className="text-3xl font-bold text-[#2F4A2D] mb-10">Promociones 💸</h2>

          {loadingPromos ? (
            <p className="text-gray-500 italic">Cargando promociones...</p>
          ) : promociones.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
              {promociones.map((prod: any) => (
                <ProductCard key={`promo-${prod.id}`} producto={prod} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay promociones por ahora.</p>
          )}
        </div>
      </section>

     

      {/* ================= PRODUCTOS DESTACADOS ================= */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <h2 className="text-3xl font-bold text-[#2F4A2D] mb-10">Productos Destacados 🔥</h2>

          {loadingDestacados ? (
            <p className="text-gray-500 italic">Cargando destacados...</p>
          ) : productosDestacados.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
              {productosDestacados.map((prod: any) => (
                <ProductCard key={`dest-${prod.id}`} producto={prod} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No se encontraron productos destacados.</p>
          )}

          <div className="mt-10">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center rounded-full border border-[#8D868D] px-8 py-2 text-sm font-medium text-[#333] hover:bg-[#5F6B58] transition"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}