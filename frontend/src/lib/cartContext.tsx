"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, cantidad: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "mate-unico-persist-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { console.error("Error cargando carrito", e); }
    }
    setIsInitialized(true);
  }, []);

  // Guardar datos en localStorage ante cualquier cambio
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(i => 
        i.productId === newItem.productId && 
        i.variantId === newItem.variantId &&
        i.textoGrabado === newItem.textoGrabado
      );
      
      if (existing) {
        return prev.map(i => 
          i.productId === newItem.productId && 
          i.variantId === newItem.variantId &&
          i.textoGrabado === newItem.textoGrabado
            ? { ...i, cantidad: i.cantidad + newItem.cantidad } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (target: CartItem, n: number) => {
    setItems(prev => prev.map(i => 
      i.productId === target.productId && 
      i.variantId === target.variantId &&
      i.textoGrabado === target.textoGrabado
        ? { ...i, cantidad: Math.max(1, n) } : i
    ));
  };

  const removeFromCart = (target: CartItem) => {
    setItems(prev => prev.filter(i => !(
      i.productId === target.productId && 
      i.variantId === target.variantId &&
      i.textoGrabado === target.textoGrabado
    )));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const total = useMemo(() => items.reduce((acc, i) => acc + (i.precioUnitario * i.cantidad), 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart debe usarse dentro de un CartProvider");
  return c;
};