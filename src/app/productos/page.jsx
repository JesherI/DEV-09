"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import ProductCard from "../components/productos/productoscard";
import Navbar from "../components/navbar/navbar";
import Link from "next/link";

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    versionInicio: "",
    versionFinal: "",
    precio: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos cuando se monta el componente
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const imageRef = ref(storage, `productos/${uuidv4()}`);
    const snap = await uploadBytes(imageRef, imageFile);
    const url = await getDownloadURL(snap.ref);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrl = await handleImageUpload();

      const parsedPrice = parseFloat(formData.precio);
      if (isNaN(parsedPrice)) {
        alert("Por favor, ingresa un precio válido.");
        return;
      }

      // Agregar el producto a Firestore
      await addDoc(collection(db, "productos"), {
        ...formData,
        imagen: imageUrl,
        precio: parsedPrice,
        timestamp: new Date(),
      });

      // Mostrar mensaje de éxito
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);

      // Limpiar formulario
      setFormData({
        nombre: "",
        versionInicio: "",
        versionFinal: "",
        precio: "",
      });
      setImageFile(null);
      setPreviewURL("");

      // Cerrar formulario
      setShowForm(false);

      // Obtener los productos después de agregar uno nuevo
      fetchProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const fetchProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const productosData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProductos(productosData);
  };

  return (
    <>
      <div className="absolute bg-black top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20">
        <img src="/DEV-09.png" alt="Logo" className="w-20 h-20" />
        <Navbar />
      </div>

      <div className="mt-20 min-h-screen bg-black p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Productos</h1>

        <div className="mt-15 flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-400 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-xl transition"
          >
            Agregar Producto
          </button>
        </div>

        {successMessage && (
          <div className="p-4 bg-green-500 text-white rounded-xl mb-6 text-center">
            ¡Producto agregado con éxito!
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-zinc-800 p-6 rounded-xl w-full max-w-md space-y-4 relative"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                Nuevo Producto
              </h2>

              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleImageClick}
                className="w-full h-40 border-2 border-dashed border-gray-500 rounded-xl flex items-center justify-center cursor-pointer bg-zinc-700 hover:border-red-400"
              >
                {previewURL ? (
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-300">
                    Arrastra o haz clic para cargar una imagen
                  </span>
                )}
                <input
                  type="file"
                  id="imageInput"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Inputs de datos */}
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-700 text-white"
                required
              />
              <input
                type="text"
                name="versionInicio"
                placeholder="Versión inicial"
                value={formData.versionInicio}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-700 text-white"
                required
              />
              <input
                type="text"
                name="versionFinal"
                placeholder="Versión final"
                value={formData.versionFinal}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-700 text-white"
                required
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-700 text-white"
                required
              />

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded font-semibold"
                  disabled={uploading}
                >
                  {uploading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      nombre: "",
                      versionInicio: "",
                      versionFinal: "",
                      precio: "",
                    });
                    setImageFile(null);
                    setPreviewURL("");
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {productos.map((producto, index) => (
            <Link
              key={producto.id || index}
              href={`/productos/${producto.id}`}
              passHref
            >
              <ProductCard
                nombre={producto.nombre}
                imagen={producto.imagen}
                versionInicio={producto.versionInicio}
                versionFinal={producto.versionFinal}
                precio={producto.precio}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
