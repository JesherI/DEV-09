'use client';

import { useRouter } from 'next/navigation';
import Navbar from './components/navbar/navbar';

function HomePage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/sign-up');
  };

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

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Bienvenidos</h1>
        <div className="flex justify-center mt-6">
          <span className="text-4xl animate-bounce">↓</span>
        </div>
        <button
          onClick={handleRedirect}
          className="mt-6 bg-white text-black font-semibold py-2 px-6 rounded-xl transition duration-200 hover:bg-red-400 hover:text-white"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
}

export default HomePage;
