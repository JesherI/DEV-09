import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation"; // 🛠️ Importa usePathname
import { auth } from "../../firebase/config";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ✅ Este hook reemplaza router.pathname

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (pathname === "/") {
          router.push("/home");
        }
      } else {
        setIsLoggedIn(false);
        if (pathname !== "/") {
          router.push("/");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]); // ✅ Asegúrate de incluir pathname en dependencias

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
          <a href="/productos" className="relative group transition">Productos</a>
          <a href="/servicios" className="relative group transition">Servicios</a>
          <a href="/venta" className="relative group transition">Ventas</a>
          <a href="/computadores" className="relative group transition">Computadores</a>
        </>
      )}

      <a href="#" onClick={handleAuthClick} className="relative group transition">
        {isLoggedIn ? "Log Out" : "Sign Up"}
      </a>
    </nav>
  );
}
