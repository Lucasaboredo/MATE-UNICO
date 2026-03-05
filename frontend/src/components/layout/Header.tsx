"use client";

import Image from "next/image";
import Link from "next/link";
import { Tilt_Warp, Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";

// Fuentes
const tilt = Tilt_Warp({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Header() {
  const [shadow, setShadow] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  // 👉 Estados para el menú desplegable
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // 🛒 carrito
  const { items } = useCart();

  // 👤 usuario (Autenticación)
  const { user, logout } = useAuth();

  // 🔢 total de productos
  const cartCount = items.reduce((acc: number, item: any) => acc + item.cantidad, 0);

  // Sombra al scrollear
  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animación carrito
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const t = setTimeout(() => {
        setAnimateCart(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  // Cierra el menú si haces clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-shadow duration-300 ${
        shadow ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* 🔹 BARRA SUPERIOR VERDE */}
      <div className="w-full bg-[#5F6B58] h-[95px] flex items-center">
        <div className="mx-auto flex max-w-[1400px] w-full items-center justify-between px-10">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <Image
              src="/logo-mate.svg"
              alt="Logo Mate Único"
              width={151}
              height={226}
              className="w-[80px] h-auto mt-1"
              priority
            />
            <span className={`${tilt.className} text-[26px] text-[#FCFAF6] leading-none mt-[3px]`}>
              Mate Único
            </span>
          </Link>

          {/* ICONOS */}
          <div className="flex flex-row items-center gap-12">
            {/* ❤️ FAVORITOS */}
            <Link
              href="/favoritos"
              aria-label="Favoritos"
              className="relative transition-all duration-200 hover:opacity-80 hover:scale-105"
              title="Favoritos"
            >
              <Image
                src="/icon-heart.svg"
                alt="Favoritos"
                width={56}
                height={46}
                className="w-[26px] h-auto"
              />
            </Link>

            {/* 🛒 CARRITO (Intacto) */}
            <Link
              href="/carrito"
              aria-label="Carrito"
              className="relative transition-all duration-200 hover:opacity-80 hover:scale-105"
            >
              <Image
                src="/icon-cart.svg"
                alt="Carrito"
                width={56}
                height={46}
                className="w-[28px] h-auto"
              />
              {cartCount > 0 && (
                <span
                  className={`
                    absolute -top-2 -right-2
                    bg-[#C0392B]
                    text-white
                    text-[11px]
                    font-bold
                    w-5 h-5
                    rounded-full
                    flex items-center justify-center
                    shadow-md
                    transition-transform duration-300 ease-out
                    ${animateCart ? "scale-125" : "scale-100"}
                  `}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 👤 USUARIO (LÓGICA NUEVA) */}
            {user ? (
              // 🟢 ESTADO LOGUEADO: Avatar Beige con Dropdown
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-105"
                >
                  {/* Círculo con Inicial */}
                  <div className="w-[32px] h-[32px] rounded-full bg-[#FCFAF6] text-[#5F6B58] flex items-center justify-center font-bold text-lg shadow-sm border border-[#E6E2DB]">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-[#FCFAF6] font-medium leading-none">
                    {user.username.split(" ")[0]}
                  </span>
                </button>

                {/* MENÚ DESPLEGABLE */}
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs font-bold text-[#5F6B58] truncate">Hola, {user.username}</p>
                    </div>

                    <Link
                      href="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7F2] hover:text-[#5F6B58] transition-colors"
                    >
                      Mi Perfil / Compras
                    </Link>

                    <Link
                      href="/favoritos"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7F2] hover:text-[#5F6B58] transition-colors"
                    >
                      Mis Favoritos
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ⚪ ESTADO INVITADO
              <Link
                href="/login"
                aria-label="Login"
                className="transition-all duration-200 hover:opacity-80 hover:scale-105 flex flex-col items-center group"
              >
                <Image src="/icon-user.svg" alt="Usuario" width={36} height={35} className="w-[22px] h-auto" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 BARRA INFERIOR BEIGE (Intacta) */}
      <nav className="w-full bg-[#FCFAF6] border-b border-[#E6E2DB]">
        <div
          className={`${inter.className} mx-auto flex max-w-[1400px] items-center justify-center gap-20 py-3 text-[15px] font-medium text-[#333333]`}
        >
          {[
            { label: "Home", href: "/" },
            { label: "Productos", href: "/productos" },
            { label: "Simulador de Grabado", href: "/simulador" },
            { label: "FAQ", href: "/faq" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative pb-1 transition-all duration-200 hover:font-semibold"
            >
              <span className={isActive(item.href) ? "font-semibold text-[#2F4A2D]" : ""}>{item.label}</span>

              {isActive(item.href) && (
                <span className="absolute left-0 -bottom-[2px] w-full h-[2px] bg-[#2F4A2D]" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}