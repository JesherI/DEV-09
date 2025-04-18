"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/navbar/navbar";
import VentaCard from "../components/ventas/ventacard";

export default function VentaFormulario() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paso, setPaso] = useState(1);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(null);
  const [errores, setErrores] = useState({});
  const [cliente, setCliente] = useState({ nombre: "", apellido: "" });
  const [totalVenta, setTotalVenta] = useState(0);
  const [ventas, setVentas] = useState([]);
  const confirmacionRef = useRef(null);

  // Carga inicial de productos, servicios y ventas
  useEffect(() => {
    const cargarDatos = async () => {
      const [prodSnap, servSnap, ventasSnap] = await Promise.all([
        getDocs(collection(db, "productos")),
        getDocs(collection(db, "servicios")),
        getDocs(collection(db, "ventas")),
      ]);
      setProductosDisponibles(
        prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setServiciosDisponibles(
        servSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setVentas(ventasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    cargarDatos();
  }, []);

  // Recalcula total al cambiar selecciones
  useEffect(() => {
    let total = 0;
    productosSeleccionados.forEach((p) => {
      const base = p.precio * p.cantidad;
      const desc = p.cantidad > 1 ? 50 : 0;
      p.precioConDescuento = base - desc;
      total += p.precioConDescuento;
    });
    serviciosSeleccionados.forEach((s) => {
      total += s.precio * s.cantidad;
    });
    setTotalVenta(total);
  }, [productosSeleccionados, serviciosSeleccionados]);

  // Agregar producto/servicio
  const agregarProducto = (producto) => {
    setProductosSeleccionados((prev) => {
      const idx = prev.findIndex((p) => p.id === producto.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].cantidad++;
        return copy;
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setMostrarModal(null);
  };
  const agregarServicio = (servicio) => {
    setServiciosSeleccionados((prev) => {
      const idx = prev.findIndex((s) => s.id === servicio.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].cantidad++;
        return copy;
      }
      return [...prev, { ...servicio, cantidad: 1 }];
    });
    setMostrarModal(null);
  };

  // Modificar cantidad o eliminar
  const modificarCantidad = (tipo, idx, val) => {
    if (tipo === "producto") {
      setProductosSeleccionados((prev) => {
        const copy = [...prev];
        if (copy[idx].cantidad + val > 0) copy[idx].cantidad += val;
        return copy;
      });
    } else {
      setServiciosSeleccionados((prev) => {
        const copy = [...prev];
        if (copy[idx].cantidad + val > 0) copy[idx].cantidad += val;
        return copy;
      });
    }
  };
  const eliminarItem = (tipo, idx) => {
    if (tipo === "producto") {
      setProductosSeleccionados((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setServiciosSeleccionados((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  // Guardar venta
  const guardarVenta = async () => {
    const nueva = {
      cliente,
      productos: productosSeleccionados,
      servicios: serviciosSeleccionados,
      fecha: new Date(),
      total: totalVenta,
    };
    await addDoc(collection(db, "ventas"), nueva);
    // Reset form
    setProductosSeleccionados([]);
    setServiciosSeleccionados([]);
    setCliente({ nombre: "", apellido: "" });
    setTotalVenta(0);
    setMostrarFormulario(false);
    // Recargar ventas
    const ventasSnap = await getDocs(collection(db, "ventas"));
    setVentas(ventasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20">
        <img src="/DEV-09.png" alt="Logo" className="w-20 h-20" />
        <Navbar />
      </div>

      {/* Botón y Tickets */}
      <div className="mt-20 text-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Ventas</h1>
        <button
          onClick={() => {
            setMostrarFormulario(true);
            setPaso(1);
          }}
          className="bg-red-400 hover:bg-red-600 px-6 py-3 rounded-xl"
        >
          Crear Venta
        </button>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Ventas Registradas
        </h2>
        {ventas.length === 0 ? (
          <p className="text-center">No hay ventas registradas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {ventas.map((v) => (
              <div
                key={v.id}
                className="bg-zinc-800 p-4 rounded-2xl shadow-lg max-w-xs w-full h-auto"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">  
                    {v.cliente.nombre} {v.cliente.apellido}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {new Date(v.fecha.seconds * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-zinc-600 pt-2">
                  <h4 className="font-semibold">Productos</h4>
                  {v.productos.map((p, i) => (
                    <div key={i} className="flex justify-between mt-1">
                      <span>
                        {p.nombre} x{p.cantidad}
                      </span>
                      <span>
                        ${(p.precioConDescuento ?? p.precio).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-600 pt-2 mt-2">
                  <h4 className="font-semibold">Servicios</h4>
                  {v.servicios.map((s, i) => (
                    <div key={i} className="flex justify-between mt-1">
                      <span>
                        {s.nombre} x{s.cantidad}
                      </span>
                      <span>${s.precio.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-600 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    $
                    {(v.total !== undefined
                      ? v.total
                      : v.productos.reduce(
                          (acc, p) => acc + p.precio * p.cantidad,
                          0
                        ) +
                        v.servicios.reduce(
                          (acc, s) => acc + s.precio * s.cantidad,
                          0
                        )
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Paso a Paso */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-start pt-20 z-50 overflow-y-auto">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-3xl w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Venta</h1>

            {/* Paso 1: Selección */}
            {paso === 1 && (
              <>
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={() => setMostrarModal("producto")}
                    className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                  >
                    Agregar Producto
                  </button>
                  <button
                    onClick={() => setMostrarModal("servicio")}
                    className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                  >
                    Agregar Servicio
                  </button>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Productos Seleccionados
                  </h2>
                  {productosSeleccionados.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded mb-2"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="w-10 h-10 rounded"
                        />
                        <span>{p.nombre}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => modificarCantidad("producto", i, -1)}
                        >
                          -
                        </button>
                        <span>{p.cantidad}</span>
                        <button
                          onClick={() => modificarCantidad("producto", i, 1)}
                        >
                          +
                        </button>
                        <button
                          onClick={() => eliminarItem("producto", i)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Servicios Seleccionados
                  </h2>
                  {serviciosSeleccionados.map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded mb-2"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={s.imagen}
                          alt={s.nombre}
                          className="w-10 h-10 rounded"
                        />
                        <span>{s.nombre}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => modificarCantidad("servicio", i, -1)}
                        >
                          -
                        </button>
                        <span>{s.cantidad}</span>
                        <button
                          onClick={() => modificarCantidad("servicio", i, 1)}
                        >
                          +
                        </button>
                        <button
                          onClick={() => eliminarItem("servicio", i)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => setPaso(2)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}

            {/* Paso 2: Cliente */}
            {paso === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Datos del Cliente
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={cliente.nombre}
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    className="w-full p-2 rounded bg-zinc-800"
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={cliente.apellido}
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        apellido: e.target.value,
                      }))
                    }
                    className="w-full p-2 rounded bg-zinc-800"
                  />
                  {errores.general && (
                    <p className="text-red-500 text-sm">{errores.general}</p>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setPaso(1)}
                    className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => {
                      const errs = {};
                      if (!cliente.nombre) errs.general = "Nombre requerido";
                      if (!cliente.apellido)
                        errs.general = errs.general
                          ? errs.general + ", Apellido requerido"
                          : "Apellido requerido";
                      if (
                        productosSeleccionados.length === 0 &&
                        serviciosSeleccionados.length === 0
                      )
                        errs.general =
                          "Selecciona al menos un producto o servicio";
                      if (Object.keys(errs).length === 0) {
                        setErrores({});
                        setPaso(3);
                      } else setErrores(errs);
                    }}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {paso === 3 && (
              <div ref={confirmacionRef}>
                <h2 className="text-2xl font-semibold mb-4">Confirmación</h2>
                <ul className="mb-4 list-disc pl-5">
                  {productosSeleccionados.map((p, i) => (
                    <li key={i}>
                      {p.nombre} x{p.cantidad} - $
                      {p.precioConDescuento.toFixed(2)}
                    </li>
                  ))}
                  {serviciosSeleccionados.map((s, i) => (
                    <li key={i}>
                      {s.nombre} x{s.cantidad} - $
                      {(s.precio * s.cantidad).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold">
                  Total: ${totalVenta.toFixed(2)}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setPaso(2)}
                    className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={guardarVenta}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {/* Modal de selección */}
            {mostrarModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">
                    Seleccionar{" "}
                    {mostrarModal === "producto" ? "Producto" : "Servicio"}
                  </h2>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {(mostrarModal === "producto"
                      ? productosDisponibles
                      : serviciosDisponibles
                    ).map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          mostrarModal === "producto"
                            ? agregarProducto(item)
                            : agregarServicio(item)
                        }
                        className="flex items-center gap-4 p-2 bg-zinc-800 hover:bg-red-500 cursor-pointer rounded"
                      >
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>{item.nombre}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setMostrarModal(null)}
                    className="mt-4 text-sm text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
