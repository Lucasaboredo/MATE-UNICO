import { fetchFromStrapi } from "@/lib/api";
import ProductoDetalleView from "./ProductoDetalleView";
import { notFound } from "next/navigation";

// 👇 1. ESTO EVITA QUE NEXT.JS GUARDE CACHÉ VIEJO
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  try {
    // 1. Intentamos buscar por slug primero
    const productoRes = await fetchFromStrapi(
      `/productos?filters[slug][$eq]=${slug}&populate[imagen]=true&populate[variantes]=true&populate[opinions]=true&publicationState=preview`
    );

    let producto = productoRes.data?.[0];

    // 2. Si no encontramos por slug, intentamos por documentId (fallback para productos sin slug)
    if (!producto) {
      const productoResFallback = await fetchFromStrapi(
        `/productos?filters[documentId][$eq]=${slug}&populate[imagen]=true&populate[variantes]=true&populate[opinions]=true&publicationState=preview`
      );
      producto = productoResFallback.data?.[0];
    }

    if (!producto) {
      return notFound();
    }

    const destacadosRes = await fetchFromStrapi(
      `/productos?filters[destacado][$eq]=true&filters[slug][$ne]=${slug}&pagination[limit]=3&populate[imagen]=true&populate[variantes]=true`
    );

    const relacionados = destacadosRes.data || [];

    // ✅ DEBUG: Ver qué ID llega ahora (Debería ser el 13)
    if (producto.variantes && producto.variantes.length > 0) {
      console.log("------------------------------------------------");
      console.log(`🔍 [DEBUG MODO PREVIEW] Variantes de "${producto.nombre}":`);
      producto.variantes.forEach((v: any) => {
        console.log(`   👉 Variante: ${v.nombre} | ID: ${v.id} | Stock: ${v.stock}`);
      });
      console.log("------------------------------------------------");
    }

    return (
      <ProductoDetalleView
        producto={producto}
        relacionados={relacionados}
      />
    );
  } catch (error) {
    console.error("Error cargando producto:", error);
    return notFound();
  }
}