import { fetchFromStrapi } from "@/lib/api";

export default async function PruebaStrapiPage() {
  // si todavía no tienen products, podés probar con otro endpoint
 const data = await fetchFromStrapi("/api/productos?populate=*");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Prueba conexión con Strapi</h1>
      <p className="text-sm text-gray-700">
        Si ves JSON abajo, la conexión funciona ✅
      </p>
      <pre className="bg-white p-4 rounded shadow text-xs overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}


