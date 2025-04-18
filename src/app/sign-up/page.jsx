"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

function LoginForm({
  onSubmit,
  loading,
  error,
  email,
  setEmail,
  password,
  setPassword,
  showPass,
  setShowPass,
  onGoogle,
}) {
  return (
    <form onSubmit={onSubmit} className="w-full p-8 space-y-6 bg-black">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Login</h2>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="peer w-full px-4 pt-6 pb-2 bg-transparent text-white placeholder-white border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Correo electrónico"
        />
      </div>

      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="peer w-full px-4 pt-6 pb-2 bg-transparent text-white placeholder-white border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Contraseña"
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-4 top-3 text-red-400"
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded-xl transition"
      >
        {loading ? "Cargando..." : "Iniciar sesión"}
      </button>
      {error && <p className="text-red-500 text-center">{error.message}</p>}

      <div className="flex items-center justify-center space-x-2">
        <span className="h-px flex-1 bg-red-700"></span>
        <span className="text-red-400">o</span>
        <span className="h-px flex-1 bg-red-700"></span>
      </div>

      <button
        type="button"
        onClick={onGoogle}
        className="w-full flex items-center justify-center space-x-2 border border-red-700 rounded-xl py-2 hover:bg-red-800 transition bg-black"
      >
        <FcGoogle className="w-6 h-6" />
        <span className="text-white">Google Login</span>
      </button>
    </form>
  );
}

function SignUpForm({
  onSubmit,
  loading,
  error,
  email,
  setEmail,
  password,
  setPassword,
  confirm,
  setConfirm,
  showPass,
  setShowPass,
  onGoogle,
}) {
  return (
    <form onSubmit={onSubmit} className="w-full p-8 space-y-6 bg-black">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Sign Up</h2>

      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="peer w-full px-4 pt-6 pb-2 bg-transparent text-white placeholder-white border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Correo electrónico"
        />
      </div>

      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="peer w-full px-4 pt-6 pb-2 bg-transparent text-white placeholder-white border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Contraseña"
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-4 top-3 text-red-400"
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="peer w-full px-4 pt-6 pb-2 bg-transparent text-white placeholder-white border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Confirmar contraseña"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded-xl transition"
      >
        {loading ? "Cargando..." : "Crear cuenta"}
      </button>
      {error && <p className="text-red-500 text-center">{error.message}</p>}

      <div className="flex items-center justify-center space-x-2">
        <span className="h-px flex-1 bg-red-700"></span>
        <span className="text-red-400">o</span>
        <span className="h-px flex-1 bg-red-700"></span>
      </div>

      <button
        type="button"
        onClick={onGoogle}
        className="w-full flex items-center justify-center space-x-2 border border-red-700 rounded-xl py-2 hover:bg-red-800 transition bg-black"
      >
        <FcGoogle className="w-6 h-6" />
        <span className="text-white">Google Sign Up</span>
      </button>
    </form>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [signInWithEmailAndPassword, , loadingLogin, errorLogin] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword, , loadingSignUp, errorSignUp] = useCreateUserWithEmailAndPassword(auth);

  // Detectar si venimos de un redirect
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };
    checkRedirect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(email, password);
      } else {
        await createUserWithEmailAndPassword(email, password);
      }
      router.push("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <>
      <Head>
        <title>{mode === "login" ? "Iniciar Sesión" : "Sign Up"}</title>
      </Head>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
          <div className="flex bg-black">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 font-semibold transition-colors ${
                mode === "login"
                  ? "bg-red-700 text-white"
                  : "bg-black text-gray-400 hover:bg-gray-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 font-semibold transition-colors ${
                mode === "signup"
                  ? "bg-red-700 text-white"
                  : "bg-black text-gray-400 hover:bg-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div
            className="flex w-[200%] transition-transform duration-500 bg-black"
            style={{
              transform: mode === "login" ? "translateX(0)" : "translateX(-50%)",
            }}
          >
            <div className="w-1/2">
              <LoginForm
                onSubmit={handleSubmit}
                loading={loadingLogin}
                error={errorLogin}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPass={showPass}
                setShowPass={setShowPass}
                onGoogle={handleGoogle}
              />
            </div>
            <div className="w-1/2">
              <SignUpForm
                onSubmit={handleSubmit}
                loading={loadingSignUp}
                error={errorSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirm={confirm}
                setConfirm={setConfirm}
                showPass={showPass}
                setShowPass={setShowPass}
                onGoogle={handleGoogle}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
