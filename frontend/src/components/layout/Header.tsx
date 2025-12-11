"use client";

import Image from "next/image";
import Link from "next/link";
import { Tilt_Warp, Inter } from "next/font/google";

// Fuentes
const tilt = Tilt_Warp({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Header() {
  return (
    <header className="w-full">
      {/* 🔹 BARRA SUPERIOR VERDE COMPACTADA */}
      <div className="w-full bg-[#5F6B58] h-[95px] flex items-center">
        <div className="mx-auto flex max-w-[1400px] w-full items-center justify-between px-10">
          {/* LOGO + TEXTO */}
          <div className="flex items-center gap-1">
            <Image
              src="/logo-mate.svg"
              alt="Logo Mate Único"
              width={151}
              height={226}
              className="w-[80px] h-auto mt-1"
              priority
            />

            <span
              className={`${tilt.className} text-[26px] text-[#FCFAF6] leading-none mt-[3px]`}
            >
              Mate Único
            </span>
          </div>

          {/* ICONOS: carrito IZQ — usuario DER */}
          <div className="flex flex-row items-center gap-12">
            {/* Carrito */}
            <button aria-label="Carrito">
              <Image
                src="/icon-cart.svg"
                alt="Carrito"
                width={56}
                height={46}
                className="w-[28px] h-auto"
              />
            </button>

            {/* Usuario */}
            <button aria-label="Usuario">
              <Image
                src="/icon-user.svg"
                alt="Usuario"
                width={36}
                height={35}
                className="w-[22px] h-auto"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 BARRA INFERIOR BEIGE */}
      <nav className="w-full bg-[#FCFAF6] border-b border-[#E6E2DB]">
        <div
          className={`${inter.className} mx-auto flex max-w-[1400px] items-center justify-center gap-20 py-3 text-[15px] font-medium text-[#333333]`}
        >
          <Link href="/">Home</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/simulador">Simulador de Grabado</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </nav>
    </header>
  );
}



















