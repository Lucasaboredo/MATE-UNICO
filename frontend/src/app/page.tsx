import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default async function Home() {
  /* ================= HERO CAROUSEL ================= */
  // IMPORTANTE: usamos imagen_hero (no imagen)
  const home = await fetchFromStrapi("/homes?populate[imagen_hero]=true");
  const slides = home.data ?? [];

  if (!slides.length) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: no hay contenido publicado para la Home en Strapi.
      </div>
    );
  }

  /* ================= PRODUCTOS DESTACADOS ================= */
  const prodRes = await fetchFromStrapi(
    "/productos?filters[destacado][$eq]=true&populate=imagen"
  );

  const productosDestacados = prodRes.data || [];

  return (
    <div className="w-full flex flex-col items-center">

      {/* ================= HERO ================= */}
      <HeroCarousel slides={slides} />

      {/* ================= PRODUCTOS DESTACADOS ================= */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">

          <h2 className="text-3xl font-bold text-[#2F4A2D] mb-10">
            Productos Destacados 🔥
          </h2>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {productosDestacados.map((prod: any) => {
              const img = prod.imagen?.[0];
              const imgUrl = img?.url ? `${STRAPI_URL}${img.url}` : null;

              return (
                <div
                  key={prod.id}
                  className="flex flex-col items-center text-center w-full max-w-[260px]"
                >
                  <div className="relative w-full h-[260px] rounded-[12px] overflow-hidden cursor-pointer shadow-md">
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt={img?.alternativeText || prod.nombre}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>

                  <h3 className="mt-4 text-[20px] font-semibold text-[#333]">
                    {prod.nombre}
                  </h3>

                  <p className="text-[#555] text-[16px]">
                    ${prod.precioBase.toLocaleString("es-AR")}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center rounded-full border border-[#8D868D] px-8 py-2 text-sm font-medium text-[#333] hover:bg-[#5F6B58] transition"
            >
              Ver más
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
