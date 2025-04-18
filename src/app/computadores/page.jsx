"use client";

import React, { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Importa la referencia de Firestore
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Importa las funciones necesarias de Firestore
import { auth } from "../firebase/config"; // Importa Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/navbar/navbar"; // Asegúrate de que la ruta sea correcta

const Computadores = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [computadoresRegistrados, setComputadoresRegistrados] = useState([]);

  // Función para obtener los detalles del navegador
  const obtenerDatosSistema = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const browserInfo = {
      userAgent,
      platform,
    };
    return browserInfo;
  };

  // Función para manejar el envío de los datos del navegador
  const handleSendData = async () => {
    if (userData) {
      try {
        // Verificar si los datos ya existen en Firestore
        const q = query(
          collection(db, "datos_computadora"),
          where("userAgent", "==", userData.userAgent),
          where("platform", "==", userData.platform)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Si ya existe, no hacemos nada
          alert("Los datos de esta computadora ya están registrados.");
        } else {
          // Si no existe, registramos los datos
          await addDoc(collection(db, "datos_computadora"), {
            userAgent: userData.userAgent, // Información del navegador
            platform: userData.platform, // Sistema operativo del navegador
            username: auth.currentUser ? auth.currentUser.displayName : "Desconocido",
            dateSent: new Date(),
          });
          alert("Datos enviados correctamente.");
          obtenerComputadoresRegistrados(); // Actualizar la lista de computadoras registradas
        }
      } catch (error) {
        console.error("Error enviando los datos: ", error);
        alert("Hubo un error al enviar los datos.");
      }
    } else {
      alert("No se encontraron datos del sistema.");
    }
  };

  // Función para obtener las computadoras registradas
  const obtenerComputadoresRegistrados = async () => {
    try {
      const snapshot = await getDocs(collection(db, "datos_computadora"));
      const data = snapshot.docs.map((doc) => doc.data());
      setComputadoresRegistrados(data);
    } catch (error) {
      console.error("Error obteniendo los computadores registrados: ", error);
    }
  };

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(obtenerDatosSistema()); // Obtener los datos del sistema
        obtenerComputadoresRegistrados(); // Obtener las computadoras registradas desde Firestore
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      {/* Barra de navegación */}
      <div className="absolute bg-black top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20">
        <img src="/DEV-09.png" alt="Logo" className="w-20 h-20" />
        <Navbar />
      </div>

      {/* Sección principal */}
      <div className="mt-20 min-h-screen bg-black p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Datos del Sistema</h1>

        {/* Mostrar los datos del sistema si están disponibles */}
        {userData ? (
          <div className="border p-4 rounded-lg">
            <p><strong>Agente de usuario (User Agent):</strong> {userData.userAgent}</p>
            <p><strong>Plataforma (Sistema Operativo):</strong> {userData.platform}</p>
            <p><strong>Nombre de usuario:</strong> {auth.currentUser ? auth.currentUser.displayName : "Desconocido"}</p>
          </div>
        ) : (
          <p>No se pudieron obtener los datos del sistema.</p>
        )}

        {/* Botón para enviar los datos */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSendData}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Enviar Datos
          </button>
        </div>

        {/* Mostrar las computadoras registradas */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center">Computadoras Registradas</h2>
          {computadoresRegistrados.length === 0 ? (
            <p className="text-center mt-4">No hay computadoras registradas.</p>
          ) : (
            <ul className="list-disc pl-6">
              {computadoresRegistrados.map((computador, index) => (
                <li key={index}>
                  <p><strong>Nombre de Usuario:</strong> {computador.username}</p>
                  <p><strong>Agente de Usuario:</strong> {computador.userAgent}</p>
                  <p><strong>Plataforma:</strong> {computador.platform}</p>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Computadores;
