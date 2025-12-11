import Image from "next/image";

export function ProductoCard({ producto }: any) {
  const img = producto?.imagen?.[0];

  return (
    <div className="bg-[#3F3A36] rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition">
      
      {/* Imagen FULL-BORDER estilo figma */}
      {img && (
        <Image
          src={`http://localhost:1337${img.url}`}
          alt={producto.nombre}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#FCFAF6]">
          {producto.nombre}
        </h2>

        <p className="text-[#FCFAF6]/70 mt-1">
          ${producto.precioBase?.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
