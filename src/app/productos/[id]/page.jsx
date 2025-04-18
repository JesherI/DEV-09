"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storageRef, deleteObject } from "firebase/storage";
import Navbar from "../../components/navbar/navbar";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function ProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const productId = pathname.split("/").pop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Confirmación de borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({ msg: "", type: "" });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, "productos", productId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        setError("Producto no encontrado");
      } else {
        setProduct({ id: snap.id, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      // Extraer el path del archivo desde la URL
      const pathStart = imageUrl.indexOf("/o/") + 3;
      const pathEnd = imageUrl.indexOf("?");
      const fullPath = decodeURIComponent(
        imageUrl.substring(pathStart, pathEnd)
      );
      const imageRef = storageRef(storage, fullPath);
      await deleteObject(imageRef);
    } catch (err) {
      console.error("Error al eliminar imagen del Storage:", err);
    }
  };

  const uploadNewImage = async () => {
    if (!editImageFile) return product.imagen;
    const imageRef = ref(storage, `productos/${crypto.randomUUID()}`);
    const snap = await uploadBytes(imageRef, editImageFile);
    return getDownloadURL(snap.ref);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrl = await uploadNewImage();
      const docRef = doc(db, "productos", productId);
      await updateDoc(docRef, {
        nombre: editData.nombre,
        versionInicio: editData.versionInicio,
        versionFinal: editData.versionFinal,
        precio: parseFloat(editData.precio),
        imagen: imageUrl,
      });
      setToast({ msg: "Actualizado con éxito", type: "success" });
      setShowEditModal(false);
      fetchProduct();
    } catch (err) {
      console.error(err);
      setToast({ msg: "Error al actualizar", type: "error" });
    } finally {
      setUploading(false);
      setTimeout(() => setToast({ msg: "", type: "" }), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      if (product?.imagen) {
        await deleteImageFromStorage(product.imagen);
      }
      await deleteDoc(doc(db, "productos", productId));
      setToast({ msg: "Eliminado con éxito", type: "success" });
      setTimeout(() => router.push("/productos"), 1500);
    } catch (err) {
      console.error(err);
      setToast({ msg: "Error al eliminar", type: "error" });
      setTimeout(() => setToast({ msg: "", type: "" }), 3000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-blue-600">Cargando…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push("/productos")}
          className="flex items-center px-6 py-2 bg-zinc-700 border border-zinc-600 rounded-2xl text-white hover:bg-zinc-600 transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      </div>
    );

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20 bg-black/70 backdrop-blur-md">
        <img src="/DEV-09.png" alt="Logo" className="w-20 h-20" />
        <Navbar />
      </div>

      <div className="mt-80 bg-neutral-900 p-8 text-white max-w-3xl mx-auto space-y-8 rounded-2xl">
        <h1 className="text-5xl font-light text-white text-center tracking-wide break-words">
          {product.nombre}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {product.imagen && (
            <div className="w-full max-w-sm mx-auto relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-60 object-contain transition duration-300"
              />
            </div>
          )}
          <div className="flex-1 space-y-4 text-lg whitespace-normal break-words">
            <p className="truncate">
              <span className="font-semibold text-white">Versión inicial:</span>{" "}
              {product.versionInicio}
            </p>
            <p>
              <span className="font-semibold text-white">Versión final:</span>{" "}
              {product.versionFinal}
            </p>
            <p>
              <span className="font-semibold text-white">Precio:</span> $
              {product.precio.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold text-white">Creado el:</span>{" "}
              {product.timestamp
                ? new Date(
                    product.timestamp.seconds * 1000
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/productos")}
            className="flex items-center px-6 py-2 bg-zinc-700 border border-zinc-600 rounded-2xl text-white hover:bg-zinc-600 transition shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver
          </button>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditData({
                  nombre: product.nombre,
                  versionInicio: product.versionInicio,
                  versionFinal: product.versionFinal,
                  precio: product.precio.toString(),
                });
                setShowEditModal(true);
              }}
              className="flex items-center px-6 py-2 bg-blue-400 text-black font-semibold rounded-2xl hover:bg-blue-500 transition shadow-md"
            >
              <Edit2 className="w-5 h-5 mr-2" /> Editar
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-6 py-2 bg-red-400 text-white rounded-2xl hover:bg-red-500 transition shadow-md"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-[#111] p-6 rounded-2xl w-full max-w-md space-y-6 shadow-xl backdrop-blur-md"
          >
            <h2 className="text-2xl font-medium text-white text-center break-words">
              Editar Producto
            </h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file?.type.startsWith("image/")) setEditImageFile(file);
              }}
              onClick={() => document.getElementById("editImageInput").click()}
              className="h-32 border-2 border-dashed border-[#00BFFF] rounded-2xl flex items-center justify-center bg-[#222] hover:border-[#00e5ff] cursor-pointer transition"
            >
              {editImageFile ? (
                <img
                  src={URL.createObjectURL(editImageFile)}
                  alt="Vista previa"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-[#00BFFF]">
                  Arrastra o clic para cambiar imagen
                </span>
              )}
              <input
                type="file"
                id="editImageInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => setEditImageFile(e.target.files[0])}
              />
            </div>

            {[
              { key: "nombre", placeholder: "Nombre completo" },
              { key: "versionInicio", placeholder: "Versión inicial completa" },
              { key: "versionFinal", placeholder: "Versión final completa" },
              { key: "precio", placeholder: "Precio" },
            ].map((field) => (
              <input
                key={field.key}
                type={field.key === "precio" ? "number" : "text"}
                placeholder={field.placeholder}
                value={editData[field.key]}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, [field.key]: e.target.value }))
                }
                className="w-full p-2 rounded bg-[#222] text-white placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50 break-words"
                required
              />
            ))}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-zinc-700 rounded-2xl hover:bg-zinc-600 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-[#00BFFF] text-black rounded-2xl hover:bg-[#00e5ff] transition"
              >
                {uploading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-full max-w-sm text-center space-y-4 border border-red-600 shadow-xl backdrop-blur-md break-words">
            <p className="text-lg">¿Eliminar este producto?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-zinc-700 rounded-2xl hover:bg-zinc-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md border break-words ${
            toast.type === "success"
              ? "bg-[#00FFC3]/30 text-[#00FFC3] border-[#00FFC3]"
              : "bg-[#FF0033]/30 text-[#FF0033] border-[#FF0033]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
