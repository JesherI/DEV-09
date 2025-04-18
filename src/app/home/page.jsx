"use client";

import Navbar from "../components/navbar/navbar";

function HomePage() {

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20">
        <img src="/DEV-09.png" alt="Logo" className="w-20 h-20" />
        <Navbar />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/DEV-09.png"
          alt="Marca de agua"
          className="w-[80rem] select-none opacity-10"
        />
      </div>
    </main>
  );
}

export default HomePage;
