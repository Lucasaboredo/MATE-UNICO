"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

// Inter para todo el footer: regular, semibold y bold
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Footer() {
  return (
    <footer className="w-full mt-16">
      {/* BLOQUE GRIS CLARO (B3B3B3) */}
      <div className="w-full bg-[#B3B3B3]">
        <div
          className={`${inter.className} mx-auto flex max-w-[1400px] items-center justify-between px-10 py-8`}
        >
          {/* Columna de textos */}
          <div className="flex items-start gap-16">
            {/* Páginas */}
            <div>
              <p className="text-[14px] font-semibold text-[#333333] mb-3">
                Páginas
              </p>
              <ul className="space-y-1 text-[13px] font-normal text-[#333333]">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>
                  <Link href="/productos">Productos</Link>
                </li>
                <li>
                  <Link href="/preguntas-frecuentes">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/simulador">Simulador de Grabado</Link>
                </li>
              </ul>
            </div>

            {/* Métodos de pago */}
            <div>
              <p className="text-[14px] font-semibold text-[#333333] mb-3">
                Métodos de pago
              </p>
              <Image
                src="/logonegro-mp.svg"
                alt="Logo Mercado Pago"
                width={120}
                height={40}
                className="h-auto w-[120px]"
              />
            </div>
          </div>

          {/* Mate negro a la derecha */}
          <div className="hidden md:block">
            <Image
              src="/logonegro-mate.svg"
              alt="Logo Mate Unico negro"
              width={60}
              height={90}
              className="h-auto w-[60px]"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE GRIS OSCURO (999999) CON COPYRIGHT */}
      <div className="w-full bg-[#999999]">
        <div
          className={`${inter.className} mx-auto max-w-[1400px] px-10 py-3 text-[12px] font-bold text-[#333333]`}
        >
          Copyright Mate Unico - 2025. Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
