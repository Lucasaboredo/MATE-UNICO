"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

// Configuración de la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Footer() {
  return (
    <footer className={`${inter.className} w-full text-[#333333]`}>

      {/* BLOQUE PRINCIPAL (Gris Claro #B3B3B3) */}
      <div className="w-full bg-[#B3B3B3] pt-16 pb-12">
        <div className="mx-auto max-w-[1400px] px-6">

          {/* GRID DE 4 COLUMNAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">

            {/* 1. MARCA / LOGO */}
            <div className="space-y-6">
              <Link href="/" className="block w-fit">
                <Image
                  src="/logonegro-mate.svg"
                  alt="Mate Único"
                  width={220}
                  height={80}
                  className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-sm leading-relaxed max-w-xs font-normal text-[#333333]">
                Redescubrí la tradición. Ofrecemos mates artesanales de alta calidad,
                diseñados para acompañarte en cada momento.
              </p>
            </div>

            {/* 2. PÁGINAS */}
            <div>
              <p className="text-[14px] font-bold text-[#333333] mb-4 uppercase tracking-wide">
                Páginas
              </p>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link href="/" className="hover:underline underline-offset-2 transition-all opacity-80 hover:opacity-100">Inicio</Link>
                </li>
                <li>
                  <Link href="/productos" className="hover:underline underline-offset-2 transition-all opacity-80 hover:opacity-100">Productos</Link>
                </li>
                <li>
                  <Link href="/simulador" className="flex items-center gap-2 hover:underline underline-offset-2 transition-all opacity-80 hover:opacity-100">
                    Simulador 3D
                    <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">Nuevo</span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline underline-offset-2 transition-all opacity-80 hover:opacity-100">Preguntas Frecuentes</Link>
                </li>
              </ul>
            </div>

            {/* 3. AYUDA */}
            <div>
              <p className="text-[14px] font-bold text-[#333333] mb-4 uppercase tracking-wide">
                Ayuda
              </p>
              <ul className="space-y-3 text-sm font-medium opacity-80">
                <li>
                  <Link href="/contacto" className="hover:underline underline-offset-2 hover:opacity-100">Contacto</Link>
                </li>
                <li>
                  <Link href="/terminos" className="hover:underline underline-offset-2 hover:opacity-100">Términos y Condiciones</Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:underline underline-offset-2 hover:opacity-100">Política de Privacidad</Link>
                </li>
              </ul>
            </div>

            {/* 4. MÉTODO DE PAGO (Tarjeta destacada) */}
            <div>
              {/* Ajusté 'text-white' a 'text-[#333333]' para que se lea sobre el fondo gris claro */}
              <h4 className="font-bold text-[14px] text-[#333333] mb-4 uppercase tracking-wide">
                Métodos de Pago
              </h4>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-700/10">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Procesado por
                </p>
                {/* LOGO MERCADO PAGO */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/mercadopago.svg" // Usa el logo a color o logonegro-mp.svg según prefieras
                    alt="Mercado Pago"
                    width={100}
                    height={30}
                    className="h-8 w-auto"
                  />
                </div>
                <p className="mt-4 text-xs text-gray-500 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Compra 100% segura
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BLOQUE INFERIOR (Gris Oscuro #999999) */}
      <div className="w-full bg-[#999999] border-t border-[#888888]/20">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] font-bold text-[#333333]">
            Copyright Mate Unico - {new Date().getFullYear()}. Todos los derechos reservados.
          </p>

          <div className="flex gap-5 text-[#333333] opacity-80">
            {/* Redes Sociales */}
            <a href="#" className="hover:scale-110 transition-transform" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="#" className="hover:scale-110 transition-transform" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}