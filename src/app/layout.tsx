// src/app/layout.tsx -new

/*
(este archivo aplica a toda la app: public, auth y app privada)
⚠️ Este es el único lugar donde puede haber <html> y <body>.
*/

import "@/app/globals.css";

export const metadata = {
  title: "Flashcards Linguins v6 – Focus Flow",
  description: "Plataforma de aprendizaje de idiomas con flashcards inteligentes e IA adaptativa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
