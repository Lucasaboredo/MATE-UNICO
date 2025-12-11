// src/app/test-productos/page.tsx
import { getAllProducts } from "@/lib/products";

export default async function TestProductosPage() {
  const data = await getAllProducts();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Prueba conexión productos (Strapi)
      </h1>

      <p className="mb-4">
        Si ves JSON abajo, la conexión con <strong>Strapi /api/productos</strong> funciona ✅
      </p>

      <pre className="bg-gray-100 p-6 rounded text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
