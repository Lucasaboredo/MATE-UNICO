// src/app/faq/page.tsx
import { fetchFromStrapi } from "@/lib/api";

/* =========================
   TIPOS
========================= */
type Block = {
  type: string;
  children?: { type: string; text?: string }[];
};

type ImagenStrapi = {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
};

type Seccion = {
  id: number;
  titulo: string;
  descripcion: Block[] | null;
  icono?: ImagenStrapi;
};

type FAQEntry = {
  secciones: Seccion[];
  imagen_footer?: ImagenStrapi;
};

export default async function FAQPage() {
  // Query corregida y optimizada
  const query = "populate[secciones][populate]=*&populate[imagen_footer]=true";
  const res = await fetchFromStrapi(`/faq-pages?${query}`);
  const faq: FAQEntry | undefined = res?.data?.[0];

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:1337";

  // Helper para URLs
  const getImageUrl = (img?: ImagenStrapi) => {
    if (!img?.url) return null;
    return img.url.startsWith("http") ? img.url : `${STRAPI_URL}${img.url}`;
  };

  const footerImageUrl = getImageUrl(faq?.imagen_footer);

  if (!faq) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        <p>Cargando preguntas frecuentes...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FCFAF6] text-[#1a1a1a]">
      {/* === HERO SECTION === */}
      <div className="relative bg-[#FAF7F2] px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
           <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-bl from-[#E5E0D8] to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-[#D6CEC5] bg-white/60 backdrop-blur-sm px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C5149] shadow-sm">
            Centro de Ayuda
          </span>
          <h1 className="text-4xl font-black tracking-tighter text-[#2F4A2D] md:text-5xl lg:text-7xl mb-6 uppercase">
            Preguntas Frecuentes
          </h1>
          <div className="h-1.5 w-24 bg-[#6B5E54] rounded-full mx-auto mb-8"></div>
          <p className="mx-auto max-w-2xl text-base text-[#5C5149] md:text-lg leading-relaxed font-medium">
            Resolvemos tus dudas sobre compras, envíos y personalización para que tu experiencia con Mate Único sea excepcional.
          </p>
        </div>
      </div>

      {/* === LISTA ACORDEÓN === */}
      <div className="mx-auto max-w-4xl px-6 pb-28 -mt-10 relative z-20">
        <div className="flex flex-col gap-4">
          {faq.secciones.map((sec) => {
            const iconUrl = getImageUrl(sec.icono);

            // FUNCIÓN PARA ASIGNAR EMOJI SEGÚN EL TÍTULO
            const getIconForTitle = (titulo: string) => {
              const lowerT = titulo.toLowerCase();
              if (lowerT.includes("envío") || lowerT.includes("entrega") || lowerT.includes("llega")) return "🚚";
              if (lowerT.includes("pago") || lowerT.includes("tarjeta") || lowerT.includes("cuotas")) return "💳";
              if (lowerT.includes("producto") || lowerT.includes("mate") || lowerT.includes("calabaza")) return "🧉";
              if (lowerT.includes("cambio") || lowerT.includes("devolución")) return "🔄";
              if (lowerT.includes("curar") || lowerT.includes("cuidado") || lowerT.includes("limpieza")) return "✨";
              if (lowerT.includes("personaliza") || lowerT.includes("grabado") || lowerT.includes("láser")) return "✏️";
              if (lowerT.includes("mayorista") || lowerT.includes("revendedores") || lowerT.includes("local")) return "🤝";
              if (lowerT.includes("promo") || lowerT.includes("descuento") || lowerT.includes("código")) return "🎟️";
              if (lowerT.includes("nosotros") || lowerT.includes("sobre")) return "⭐";
              return "📌"; // Emoji por defecto
            };

            const sectionEmoji = getIconForTitle(sec.titulo);

            return (
              <details
                key={sec.id}
                className="group w-full rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#EBE7E0] transition-all duration-300 open:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] open:border-[#D6CEC5]"
              >
                {/* CABECERA (Pregunta) */}
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 outline-none marker:hidden">
                  <div className="flex items-center gap-5">
                    {/* Ícono opcional o Emoji por título */}
                    {iconUrl ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#2F4A2D] group-hover:bg-[#EBE7E0] group-hover:scale-110 transition-all duration-300">
                        <img
                          src={iconUrl}
                          alt=""
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#2F4A2D] group-hover:bg-[#EBE7E0] group-hover:scale-110 transition-all duration-300 text-2xl shadow-sm">
                        {sectionEmoji}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-[#1a1a1a] group-hover:text-[#2F4A2D] transition-colors md:text-xl pr-4">
                      {sec.titulo}
                    </h3>
                  </div>

                  {/* Flecha animada */}
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#5C5149] transition-all duration-300 group-open:bg-[#2F4A2D] group-open:text-white">
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>

                {/* CONTENIDO (Respuesta) */}
                <div className="overflow-hidden">
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300 px-6 pb-8 pt-2 pl-[5.5rem] md:pl-[5.5rem]">
                    <div className="text-[15px] leading-relaxed text-[#5C5149] font-medium border-l-2 border-[#EBE7E0] pl-5">
                      {renderDescripcion(sec.descripcion)}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* === IMAGEN FOOTER (Banner) === */}
      {footerImageUrl && (
        <div className="w-full px-6 pb-20">
          <div className="mx-auto max-w-[1200px] overflow-hidden rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative group">
            <div className="relative h-[300px] w-full md:h-[450px]">
              <img
                src={footerImageUrl}
                alt="Mate Único"
                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 shadow-black/50 drop-shadow-md">
                  Estamos para ayudarte
                </h2>
                <div className="h-1.5 w-16 bg-[#009EE3] rounded-full mb-4"></div>
                <p className="text-white/90 text-sm md:text-base font-medium max-w-sm drop-shadow-sm">
                  Si tu duda no fue resuelta en esta sección, podés contactarnos a través de nuestros canales oficiales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================
   RENDER RICH TEXT
========================= */
function renderDescripcion(blocks: Block[] | null) {
  if (!blocks) return null;

  return blocks.map((block, i) => {
    if (block.type !== "paragraph") return null;
    const text = block.children?.map((child) => child.text).join("") ?? "";
    if (!text.trim()) return null;

    return (
      <p key={i} className="mb-3 last:mb-0">
        {text}
      </p>
    );
  });
}