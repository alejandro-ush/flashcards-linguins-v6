/* src/app/(auth)/register/page.tsx */

"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("demo@linguins.dev");
  const [password, setPassword] = useState("demo1234");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Más adelante lo conectamos a Supabase Auth + bootstrap profile
    console.log("register", { email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="mb-4 text-xl font-semibold">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Contraseña</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-teal-400 py-2 text-sm font-medium text-slate-950 hover:bg-teal-300"
          >
            Crear cuenta
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-teal-300 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
