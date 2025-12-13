"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:1337";

type Media = {
  url: string;
  alternativeText?: string;
};

type HomeEntry = {
  titulo: string;
  subtitulo: string;
  cta_texto: string;
  cta_link?: string;
  imagen_hero: Media[];
};

export default function HeroCarousel({ slides }: { slides: HomeEntry[] }) {
  // Usamos solo el primer home
  const home = slides[0];

  if (!home || !home.imagen_hero || home.imagen_hero.length === 0) {
    return null;
  }

  const images = home.imagen_hero;
  const [current, setCurrent] = useState(0);

  // ⏱️ AUTOPLAY MÁS LENTO (8 segundos)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 20000); // 👈 ACÁ CONTROLÁS EL TIEMPO

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-[#F4F1EB]">
      
      {/* IMÁGENES */}
      {images.map((img, index) => {
        const isActive = index === current;
        const url = `${STRAPI_URL}${img.url}`;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={url}
              alt={img.alternativeText || "Banner Mate Único"}
              fill
              priority={isActive}
              className="object-cover object-right"
            />
          </div>
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F4F1EB]/55 z-20" />

      {/* TEXTO */}
      <div className="relative z-30 h-full mx-auto max-w-[1200px] px-4 pt-32">
        <div className="max-w-[600px]">
          <h1 className="mb-6 text-[64px] leading-tight font-bold text-[#2F4A2D]">
            {home.titulo}
          </h1>

          <p className="mb-10 text-2xl text-[#4B4B4B]">
            {home.subtitulo}
          </p>

          {/* 👉 SIEMPRE VA A PRODUCTOS */}
          <a
            href={home.cta_link || "/productos"}
            className="inline-flex items-center justify-center rounded-md bg-[#486837] px-10 py-4 text-lg font-semibold text-white hover:bg-[#3A542D] transition"
          >
            {home.cta_texto || "Comprar ahora"}
          </a>
        </div>
      </div>

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current
                  ? "bg-[#486837] scale-125"
                  : "bg-[#486837]/40 hover:bg-[#486837]/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
