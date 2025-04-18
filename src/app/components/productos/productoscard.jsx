export default function ProductCard({
  nombre,
  imagen,
  versionInicio,
  versionFinal,
  precio,
}) {
  return (
    <div className="bg-zinc-800 text-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm transition hover:scale-105 duration-300">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-white truncate">{nombre}</h2>
      </div>
      <div className="h-48 w-full flex items-center justify-center">
        <img
          src={imagen}
          alt="Producto"
          className="max-h-full max-w-full object-contain transition duration-300"
        />
      </div>

      <div className="p-4 space-y-2 text-center">
        <h3 className="text-xl font-semibold">Versiones</h3>
        <p className="text-sm text-gray-300">
          De la versión <strong>{versionInicio}</strong> a{" "}
          <strong>{versionFinal}</strong>
        </p>
        <p className="text-lg font-bold text-white">Precio: ${precio}</p>
      </div>
    </div>
  );
}
