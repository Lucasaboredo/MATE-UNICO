import { fetchFromStrapi } from "@/lib/api";
import ProductosView from "./ProductosView.tsx";

export default async function CatalogoPage() {
  const res = await fetchFromStrapi(
    "/productos?populate[imagen]=true&populate[categoria]=true"
  );

  const productos = res.data ?? [];

  return <ProductosView productos={productos} />;
}
