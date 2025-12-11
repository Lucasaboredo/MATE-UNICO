import Image from "next/image";
import Link from "next/link";
import { fetchFromStrapi } from "@/lib/api";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default async function Home() {
  // 1. Traemos el contenido del Single Type "homes"
  const home = await fetchFromStrapi("/homes?populate=*");

  const entry = home.data?.[0];

  if (!entry) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: no hay contenido publicado para la Home en Strapi.
      </div>
    );
  }

  const titulo = entry.titulo;
  const subtitulo = entry.subtitulo;
  const ctaTexto = entry.cta_texto;
  const ctaLink = entry.cta_link || "/catalogo";

  const heroUrl = entry.imagen_hero?.url
    ? `${STRAPI_URL}${entry.imagen_hero.url}`
    : null;

  const heroAlt =
    entry.imagen_hero?.alternativeText || "Imagen principal Mate Único";

  const galeria = entry.galeria || [];

  return (
    <div className="w-full flex flex-col items-center">
{/* ================= HERO CON IMAGEN DE FONDO ================= */}
<section className="w-full">
  <div className="relative w-full bg-[#F4F1EB]" style={{ minHeight: "600px" }}>
    
    {/* Imagen de fondo */}
    {heroUrl && (
      <Image
        src={heroUrl}
        alt={heroAlt}
        fill
        className="object-cover object-right"
        priority
      />
    )}

    {/* Capa difuminada */}
    <div className="absolute inset-0 bg-[#F4F1EB]/55"></div>

    {/* Contenido */}
    <div className="relative mx-auto max-w-[1200px] px-4 pt-32">
      <div className="max-w-[600px]">
        <h1 className="mb-6 text-[64px] leading-tight font-bold text-[#2F4A2D]">
          {titulo}
        </h1>

        <p className="mb-10 text-2xl text-[#4B4B4B]">{subtitulo}</p>

        <Link
          href={ctaLink}
          className="inline-flex items-center justify-center rounded-md bg-[#486837] px-10 py-4 text-lg font-semibold text-white hover:bg-[#3A542D] transition"
        >
          {ctaTexto}
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* ================= GALERÍA ================= */}
      <section className="w-full bg-white py-12">
        <div className="mx-auto max-w-[1000px] px-4">
          {/* Grid de 4 imágenes como en Figma */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {galeria.map((img: any) => {
              const imgUrl = img.url ? `${STRAPI_URL}${img.url}` : null;

              return (
                <div
                  key={img.id}
                  className="overflow-hidden rounded-[10px] bg-[#F4F1EB]"
                >
                  <div className="relative h-[220px] w-full">
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt={img.alternativeText || "Producto destacado"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón "Ver más" tipo Figma */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-full border border-[#8D8D8D] px-8 py-2 text-sm font-medium text-[#333333] hover:bg-[#F4F1EB] transition"
            >
              Ver más
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
