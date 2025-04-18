export default function VentaCard({ nombre, imagen, precio }) {
    const total = precio; // Aquí podrías hacer un cálculo si es necesario
  
    return (
      <div className="bg-zinc-800 text-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm transition hover:scale-105 duration-300">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-white truncate">{nombre}</h2>
        </div>
        <div className="h-48 w-full flex items-center justify-center">
          <img
            src={imagen}
            alt="Servicio"
            className="max-h-full max-w-full object-contain transition duration-300"
          />
        </div>
  
        <div className="p-4 space-y-2 text-center">
          <p className="text-lg font-bold text-white">Precio: ${precio}</p>
          <span>Total: ${(total ?? 0).toFixed(2)}</span>
        </div>
      </div>
    );
  }
  