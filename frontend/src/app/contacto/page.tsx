"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación: en producción conectar con un servicio de email
    setEnviado(true);
  };

  return (
    <main className="min-h-screen bg-[#F4F1EB] text-[#333]">
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#5F6B58] uppercase tracking-widest mb-2">Escribinos</p>
          <h1 className="text-4xl font-bold text-[#2F4A2D] mb-3">Contacto</h1>
          <p className="text-[#5C5149]/70 text-base">
            Respondemos todos los mensajes dentro de las <span className="font-semibold text-[#2F4A2D]">24 horas hábiles</span>.
          </p>
        </div>

        {/* Info rápida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 border border-[#E0DCD3] flex items-start gap-4">
            <span className="text-2xl">📷</span>
            <div>
              <p className="text-xs font-bold text-[#5C5149] uppercase tracking-wide mb-1">Instagram</p>
              <a
                href="https://www.instagram.com/luca_saboredo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#2F4A2D] hover:underline"
              >
                @MATEUNICO
              </a>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#E0DCD3] flex items-start gap-4">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-xs font-bold text-[#5C5149] uppercase tracking-wide mb-1">Pedidos y envíos</p>
              <p className="text-sm text-[#5C5149]/80">Consultá por el formulario</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        {enviado ? (
          <div className="bg-[#2F4A2D] text-white rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-xl font-bold mb-2">¡Mensaje recibido!</h2>
            <p className="text-white/70 text-sm">Te respondemos en las próximas 24 horas hábiles.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E0DCD3] shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#5C5149] uppercase tracking-wide mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full border border-[#E0DCD3] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D]/30 bg-[#FAFAF8]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5149] uppercase tracking-wide mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full border border-[#E0DCD3] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D]/30 bg-[#FAFAF8]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5149] uppercase tracking-wide mb-1">Mensaje</label>
              <textarea
                name="mensaje"
                required
                value={form.mensaje}
                onChange={handleChange}
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
                className="w-full border border-[#E0DCD3] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A2D]/30 resize-none bg-[#FAFAF8]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2F4A2D] text-white font-bold py-3 rounded-full text-sm hover:bg-[#243d22] transition"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
