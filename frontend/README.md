Este documento resume todo lo construido en este Sprint RAFA para que el equipo pueda continuar con el desarrollo del catálogo y las pantallas de producto.

1. Tecnologías usadas

Frontend

-Next.js 16 (App Router)

-TypeScript

-TailwindCSS

-Google Fonts (Tilt Warp / Inter)

-Backend

Strapi v4

Base URL local: http://localhost:1337

2. Cómo levantar el proyecto

Backend (Strapi)

cd backend
npm install
npm run develop


Frontend (Next.js)

cd frontend
npm install
npm run dev


La web queda en:
http://localhost:3000

3. Variables de entorno

Crear archivo:

frontend/.env.local

Con:

NEXT_PUBLIC_API_URL=http://localhost:1337

4. Estructura del frontend
frontend/
 ├── public/
 │    ├── logo-mate.svg
 │    ├── icon-user.svg
 │    ├── icon-cart.svg
 │    ├── logonegro-mate.svg
 │    ├── logonegro-mp.svg
 │    └── (otros SVG del diseño)
 │
 ├── src/
 │   ├── app/
 │   │   ├── layout.tsx
 │   │   ├── page.tsx
 │   │   └── test-productos/
 │   │        └── page.tsx
 │   │
 │   ├── components/
 │   │   ├── layout/
 │   │   │     ├── Header.tsx
 │   │   │     └── Footer.tsx
 │   │
 │   ├── lib/
 │   │   ├── api.ts
 │   │   └── products.ts
 │   │
 │   └── types/
 │       └── product.ts
 │
 └── globals.css

5. Conexión a Strapi

Helper genérico (src/lib/api.ts):

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFromStrapi(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status} fetching ${path}`);
  }

  return res.json();
}


Función para traer productos (src/lib/products.ts):

import { fetchFromStrapi } from "./api";

export async function getAllProducts() {
  return fetchFromStrapi("/api/productos?populate=*");
}

6. Página de prueba de productos

src/app/test-productos/page.tsx:

import { getAllProducts } from "@/lib/products";

export default async function TestProductosPage() {
  const data = await getAllProducts();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Prueba conexión productos (Strapi)
      </h1>

      <pre className="bg-gray-100 p-6 rounded text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

7. Layout, Header y Footer (completos)

Header

Barra verde superior con logo, texto, íconos de carrito y usuario.

Barra inferior beige con Home / Productos / Simulador / FAQ.

Fuentes correctas: Tilt Warp + Inter.

Footer

Fondo gris claro (#B3B3B3) con enlaces y logos en Inter regular/semibold.

Fondo gris oscuro (#999999) con copyright en Inter bold.

Logos SVG incluidos en /public.

8. Próximos pasos del Sprint

Luca – Catálogo

Usar getAllProducts() para el listado general.

Armar cards de productos y filtros simples.

Joaco – Detalle de producto

Página [id]/page.tsx.

Fetch individual: /api/productos/${id}?populate=*.

Mostrar imágenes, precio, material, variantes, etc.

9. Notas importantes

No usar fetch directo en componentes.
Siempre usar fetchFromStrapi o funciones de lib/.

Todos los SVG deben ir en /public y llamarse con:

<Image src="/icon-cart.svg" width={30} height={30} />


Colores del diseño:

Verde header: #5F6B58

Beige menú: #FCFAF6

Texto gris menú: #333333

Footer gris claro: #B3B3B3

Footer gris oscuro: #999999