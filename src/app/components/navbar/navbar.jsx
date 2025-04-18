import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/config";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (router.pathname === "/") {
          router.push("/home");
        }
      } else {
        setIsLoggedIn(false);
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      auth.signOut().then(() => {
        router.push("/");
      });
    } else {
      router.push("/sign-up");
    }
  };

  if (loading) return null;

  return (
    <nav className="flex gap-11 text-white text-lg">
      <a
        key="Inicio"
        href={isLoggedIn ? "/home" : "/"}
        className="relative group transition"
      >
        Inicio
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
      </a>

      {isLoggedIn && (
        <>
          <a
            key="Productos"
            href="/productos"
            className="relative group transition"
          >
            Productos
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </a>
          <a
            key="Servicios"
            href="/servicios"
            className="relative group transition"
          >
            Servicios
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </a>
          <a
            key="Ventas"
            href="/venta"
            className="relative group transition"
          >
            Ventas
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </a>
          <a
            key="Computadores"
            href="/computadores"
            className="relative group transition"
          >
            Computadores
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </a>
        </>
      )}

      <a
        href="#"
        onClick={handleAuthClick}
        className="relative group transition"
      >
        {isLoggedIn ? "Log Out" : "Sign Up"}
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 group-hover:w-full transition-all duration-500 ease-in-out"></span>
      </a>
    </nav>
  );
}
