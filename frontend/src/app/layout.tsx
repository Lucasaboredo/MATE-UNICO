// src/app/layout.tsx

import "./globals.css";
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />

        {/* AGREGAMOS PADDING PARA QUE EL HEADER FIJO NO TAPE EL CONTENIDO */}
        <main className="pt-[140px]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

