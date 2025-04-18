'use client';
import { useState, useEffect } from 'react';

const Bubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  const createBubble = () => {
    const newBubble = {
      id: Date.now(),
      size: Math.random() * 30 + 20, 
      left: Math.random() * 100, 
      animationDuration: Math.random() * 4 + 4, 
    };
    setBubbles((prevBubbles) => [...prevBubbles, newBubble]);

    setTimeout(() => {
      setBubbles((prevBubbles) => prevBubbles.filter(bubble => bubble.id !== newBubble.id));
    }, newBubble.animationDuration * 1000);
  };

  useEffect(() => {
    const interval = setInterval(createBubble, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bg-red-400 opacity-90 rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: '-20%', // Coloca las burbujas fuera de la vista inicial
            animation: `bubbleUp ${bubble.animationDuration}s ease-in-out`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bubbleUp {
          0% {
            transform: translateY(0); /* Inicia fuera de la vista */
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh); /* Subir hasta fuera de la pantalla */
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

const NotFound = () => {
  return (
    <div className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <Bubbles />
      <div className="z-10 text-center">
        <h1 className="text-6xl font-semibold mb-6">404 - Página no encontrada</h1>
        <a href="/" className="px-6 py-3 bg-red-400 text-white font-bold rounded-lg hover:bg-red-500 transition-colors duration-300">
          Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
