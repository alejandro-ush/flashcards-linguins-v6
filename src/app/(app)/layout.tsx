// src/app/(app)/layout.tsx  -privado

/*Esto hace que TODO pase por AppShell (header + nav), y ya dejamos el look dark.
❌ Este layout NO, Debe tener <html> ni <body>. Eso va en layout -new global
 */

import type { Metadata } from "next";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "App | Flashcards Linguins",
};

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
