export default function VentaCard({
  nombre,
  apellido,
  productos = [],
  servicios = [],
  total, // Este prop viene desde el componente padre
}) {
  // Calcular el total si no se pasa como prop
  const calcularTotal = () => {
    let totalCalculado = 0;

    // Sumar productos
    productos.forEach((prod) => {
      totalCalculado += (prod.precioConDescuento || prod.precio) * prod.cantidad;
    });

    // Sumar servicios
    servicios.forEach((serv) => {
      totalCalculado += serv.precio * serv.cantidad;
    });

    return totalCalculado;
  };

  const totalFinal = total || calcularTotal(); // Usar el prop `total` si está presente

  return (
    <div className="bg-zinc-800 text-white rounded-2xl shadow-md overflow-hidden w-full max-w-md transition hover:scale-105 duration-300">
      <div className="text-center p-4 border-b border-zinc-700">
        <h2 className="text-2xl font-bold">
          {nombre} {apellido}
        </h2>
        <p className="text-sm text-zinc-400">Resumen de venta</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Productos */}
        {productos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Productos</h3>
            <ul className="space-y-2">
              {productos.map((prod, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="truncate">
                    {prod.nombre} x{prod.cantidad}
                  </span>
                  <span>
                    ${(prod.precioConDescuento || prod.precio).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Servicios */}
        {servicios.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Servicios</h3>
            <ul className="space-y-2">
              {servicios.map((serv, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="truncate">
                    {serv.nombre} x{serv.cantidad}
                  </span>
                  <span>${serv.precio.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-zinc-700 pt-4 flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>${totalFinal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
