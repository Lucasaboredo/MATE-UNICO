import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cartContext";
import { CheckoutProvider } from "@/lib/checkoutContext";
import { AuthProvider } from "@/lib/authContext"; // <--- IMPORTANTE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mate Único - Tienda Oficial",
  description: "Venta de mates artesanales y accesorios de calidad premium.",
  // Agregamos esta propiedad para el favicon
  icons: {
    icon: "/logo-mate.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Envolvemos toda la app en AuthProvider primero */}
        <AuthProvider>
          <CartProvider>
            <CheckoutProvider>
              <Header />
              <main className="pt-[140px] min-h-screen bg-[#FCFAF6]">
                {children}
              </main>
              <Footer />
            </CheckoutProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}