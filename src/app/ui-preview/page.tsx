// File: src/app/ui-preview/page.tsx
// UI Preview v6.1: muestra componentes base del UI Kit con contenido dummy.

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { CardFooter } from "@/components/ui/CardFooter";
import { Chip } from "@/components/ui/Chip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SideLabel } from "@/components/ui/SideLabel";
import { Word } from "@/components/ui/Word";
import { BottomNav } from "@/components/ui/BottomNav";

export default function UIPreviewPage() {
  return (
    <main className="p-6 space-y-8 text-slate-50">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">UI Preview v6.1</h1>
        <p className="text-sm text-slate-400">
          Muestra estática de componentes base (sin lógica ni estado).
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Flashcard – Lado A</h2>
        <Card>
          <CardHeader
            left={<Chip accent>Vocabulary</Chip>}
            right="Alemán"
          />
          <CardBody>
            <SideLabel>LADO A · ALEMÁN</SideLabel>
            <Word side="a">Apfel</Word>
          </CardBody>
          <CardFooter>
            <PrimaryButton>Ver respuesta</PrimaryButton>
            <div className="flex gap-2">
              <SecondaryButton>Anterior</SecondaryButton>
              <SecondaryButton>Siguiente</SecondaryButton>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Flashcard – Lado B</h2>
        <Card>
          <CardHeader
            left={<Chip>Vocab Trainer</Chip>}
            right="Español"
          />
          <CardBody>
            <SideLabel>LADO B · ESPAÑOL</SideLabel>
            <Word side="b">Manzana</Word>
          </CardBody>
          <CardFooter>
            <PrimaryButton>Continuar</PrimaryButton>
            <div className="flex gap-2">
              <SecondaryButton>Repetir</SecondaryButton>
              <SecondaryButton>Nuevo</SecondaryButton>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton>Primary Button</PrimaryButton>
          <SecondaryButton>Secondary Button</SecondaryButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chips</h2>
        <div className="flex flex-wrap gap-2">
          <Chip accent>Accent</Chip>
          <Chip>Default</Chip>
          <Chip>Practice</Chip>
          <Chip accent>Review</Chip>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mini Cards (4 variantes)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-cardBorder bg-cardBg p-3">
            <p className="text-xs text-textSoft">Estado</p>
            <p className="text-textMain font-semibold">Repaso rápido</p>
          </div>
          <div className="rounded-xl border border-cardBorder bg-cardBg p-3">
            <p className="text-xs text-textSoft">Progreso</p>
            <p className="text-textMain font-semibold">72% accuracy</p>
          </div>
          <div className="rounded-xl border border-cardBorder bg-cardBg p-3">
            <p className="text-xs text-textSoft">Siguiente</p>
            <p className="text-textMain font-semibold">5 ítems nuevos</p>
          </div>
          <div className="rounded-xl border border-cardBorder bg-cardBg p-3">
            <p className="text-xs text-textSoft">Insight</p>
            <p className="text-textMain font-semibold">Velocidad estable</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Bottom Navigation</h2>
  
        <BottomNav
          tabs={[
            { label: "Learn", active: true },
            { label: "Review" },
            { label: "Profile" },
          ]}
        />

      </section>
    </main>
  );
}
