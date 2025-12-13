import Image from "next/image";

export function ProductoDestacadoCard({ producto }: any) {
  const img = producto?.imagen?.[0];

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center w-full cursor-pointer">
      {img && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${img.url}`}
          alt={producto.nombre}
          width={300}
          height={300}
          className="rounded-md object-cover w-full h-[260px]"
        />
      )}

      <h3 className="mt-4 text-lg font-semibold text-center">
        {producto.nombre}
      </h3>

      <p className="text-gray-600 text-center font-medium">
        ${producto.precioBase?.toLocaleString("es-AR")}
      </p>
    </div>
  );
}
