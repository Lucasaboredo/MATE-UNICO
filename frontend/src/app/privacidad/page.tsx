import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad | Mate Único",
  description: "Política de privacidad y protección de datos de Mate Único",
};

const SECCIONES = [
  {
    titulo: "1. Datos que recopilamos",
    texto:
      "Al crear una cuenta o realizar una compra, recopilamos datos personales como nombre, correo electrónico, dirección de envío y datos de pago procesados de forma segura por Mercado Pago. No almacenamos información de tarjetas de crédito en nuestros servidores.",
  },
  {
    titulo: "2. Uso de los datos",
    texto:
      "Utilizamos tu información exclusivamente para procesar pedidos, gestionar tu cuenta, enviar confirmaciones de compra y, si lo autorizaste, comunicarte promociones y novedades. Nunca vendemos ni compartimos tus datos personales con terceros con fines comerciales.",
  },
  {
    titulo: "3. Cookies",
    texto:
      "Nuestro sitio puede utilizar cookies para mejorar la experiencia de navegación y recordar preferencias del usuario, como el contenido del carrito. Podés gestionar las cookies desde la configuración de tu navegador.",
  },
  {
    titulo: "4. Seguridad de los datos",
    texto:
      "Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración. Las transacciones económicas son procesadas por Mercado Pago con cifrado SSL.",
  },
  {
    titulo: "5. Almacenamiento de favoritos",
    texto:
      "La lista de favoritos se guarda localmente en tu dispositivo (localStorage) y no se transmite a nuestros servidores. Si limpiás los datos del navegador, esta información se perderá.",
  },
  {
    titulo: "6. Tus derechos",
    texto:
      "Conforme a la Ley 25.326 de Protección de Datos Personales (Argentina), tenés derecho a acceder, rectificar y suprimir tus datos personales. Para ejercer estos derechos, contactanos a través de nuestro formulario.",
  },
  {
    titulo: "7. Cambios en la política",
    texto:
      "Podemos actualizar esta política en cualquier momento. Te notificaremos los cambios relevantes a través del correo registrado o mediante un aviso en el sitio.",
  },
];

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#F4F1EB] text-[#333]">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#5F6B58] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-[#2F4A2D] mb-3">Política de Privacidad</h1>
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

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-[#2F4A2D] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#243d22] transition"
          >
            Contactar para consultas de privacidad
          </Link>
        </div>

      </div>
    </main>
  );
}
