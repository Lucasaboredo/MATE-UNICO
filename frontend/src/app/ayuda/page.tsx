import Link from "next/link";

export const metadata = {
  title: "Ayuda | Mate Único",
  description: "Centro de ayuda de Mate Único",
};

const PREGUNTAS = [
  {
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Navegá por nuestros productos, elegí el que más te guste, seleccioná la variante y hacé clic en 'Añadir al carrito'. Luego seguí los pasos del checkout para completar tu compra.",
  },
  {
    pregunta: "¿Cuánto tarda el envío?",
    respuesta:
      "Los envíos se realizan a través de Correo Argentino o Andreani con un plazo estimado de 3 a 7 días hábiles dependiendo de tu ubicación.",
  },
  {
    pregunta: "¿Puedo hacer un grabado personalizado?",
    respuesta:
      "¡Sí! En la página de algunos productos encontrás la opción de grabado. Podés escribir un nombre, iniciales o fecha especial de hasta 14 caracteres. También tenemos un simulador para previsualizar el diseño.",
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Aceptamos pagos a través de Mercado Pago: tarjetas de crédito, débito y pagos en efectivo en puntos de cobro habilitados.",
  },
  {
    pregunta: "¿Cómo puedo seguir mi pedido?",
    respuesta:
      "Una vez aprobado el pago, te llegará un correo con el código de seguimiento. También podés consultarlo en la sección 'Mis Compras' de tu perfil.",
  },
  {
    pregunta: "¿Tienen política de devoluciones?",
    respuesta:
      "Sí. Si el producto llega con defectos de fabricación, contactanos dentro de los 7 días de recibido y lo resolvemos sin costo adicional.",
  },
];

export default function AyudaPage() {
  return (
    <main className="min-h-screen bg-[#F4F1EB] text-[#333]">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#5F6B58] uppercase tracking-widest mb-2">Centro de ayuda</p>
          <h1 className="text-4xl font-bold text-[#2F4A2D] mb-3">¿En qué podemos ayudarte?</h1>
          <p className="text-[#5C5149]/70 text-base">
            Acá encontrás las respuestas a las preguntas más frecuentes. Si no encontrás lo que buscás,{" "}
            <Link href="/contacto" className="text-[#2F4A2D] font-semibold underline underline-offset-2">
              contactanos
            </Link>.
          </p>
        </div>

        {/* Preguntas */}
        <div className="space-y-4">
          {PREGUNTAS.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-[#E0DCD3] shadow-sm"
            >
              <h2 className="text-base font-bold text-[#2F4A2D] mb-2">{item.pregunta}</h2>
              <p className="text-sm text-[#5C5149]/80 leading-relaxed">{item.respuesta}</p>
            </div>
          ))}
        </div>

        {/* CTA Contacto */}
        <div className="mt-12 bg-[#2F4A2D] rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">¿Todavía tenés dudas?</h2>
          <p className="text-sm text-white/70 mb-5">Escribinos y te respondemos a la brevedad.</p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-white text-[#2F4A2D] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#F4F1EB] transition"
          >
            Ir a Contacto
          </Link>
        </div>

      </div>
    </main>
  );
}
