import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones | Mate Único",
  description: "Términos y condiciones de uso de Mate Único",
};

const SECCIONES = [
  {
    titulo: "1. Aceptación de los términos",
    texto:
      "Al acceder y utilizar el sitio web de Mate Único, aceptás cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguno de los puntos, te pedimos que no utilices nuestros servicios.",
  },
  {
    titulo: "2. Productos y precios",
    texto:
      "Todos los productos ofrecidos en nuestro sitio están sujetos a disponibilidad de stock. Los precios mostrados son en pesos argentinos (ARS) e incluyen IVA. Nos reservamos el derecho de modificar precios sin previo aviso, sin afectar los pedidos ya confirmados.",
  },
  {
    titulo: "3. Proceso de compra",
    texto:
      "Una vez realizado el pago a través de Mercado Pago, recibirás un correo de confirmación. El pedido se considera aceptado una vez que el pago sea verificado y aprobado por nuestra plataforma de pago.",
  },
  {
    titulo: "4. Envíos",
    texto:
      "Los envíos se realizan dentro del territorio argentino mediante Correo Argentino o Andreani. Los plazos estimados son de 3 a 7 días hábiles según la ubicación. No nos hacemos responsables por demoras atribuibles a las empresas de logística.",
  },
  {
    titulo: "5. Grabado personalizado",
    texto:
      "El grabado personalizado es un servicio adicional. Al solicitarlo, el cliente acepta que el texto ingresado cumple con las restricciones de caracteres indicadas y que no contiene contenido ofensivo, inapropiado o que infrinja derechos de terceros.",
  },
  {
    titulo: "6. Devoluciones y garantías",
    texto:
      "Aceptamos devoluciones por defectos de fabricación dentro de los 7 días hábiles posteriores a la recepción del producto. El producto debe estar sin uso y en su embalaje original. No aplicamos devoluciones por cambio de opinión.",
  },
  {
    titulo: "7. Propiedad intelectual",
    texto:
      "Todo el contenido del sitio (imágenes, textos, logotipos, diseños) es propiedad de Mate Único y está protegido por las leyes de propiedad intelectual vigentes. Queda prohibida su reproducción sin autorización previa.",
  },
  {
    titulo: "8. Modificaciones",
    texto:
      "Mate Único se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio.",
  },
];

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#F4F1EB] text-[#333]">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#5F6B58] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-[#2F4A2D] mb-3">Términos y Condiciones</h1>
          <p className="text-[#5C5149]/70 text-sm">
            Última actualización: marzo 2026.{" "}
            <Link href="/contacto" className="text-[#2F4A2D] font-semibold underline underline-offset-2">
              Ante dudas, contactanos.
            </Link>
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-6">
          {SECCIONES.map((sec, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#E0DCD3] shadow-sm">
              <h2 className="text-base font-bold text-[#2F4A2D] mb-2">{sec.titulo}</h2>
              <p className="text-sm text-[#5C5149]/80 leading-relaxed">{sec.texto}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
