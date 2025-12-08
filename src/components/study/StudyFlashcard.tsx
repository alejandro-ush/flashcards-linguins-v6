// File: src/components/study/StudyFlashcard.tsx
// Flashcard UI (dummy) usando solo componentes existentes del UI Kit v6.1.


"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { CardFooter } from "@/components/ui/CardFooter";
import { Chip } from "@/components/ui/Chip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SideLabel } from "@/components/ui/SideLabel";
import { Word } from "@/components/ui/Word";

type StudyFlashcardProps = {
  item: {
    word: string;
    translation: string;
    gender?: string;
    plural?: string;
    note?: string;
    tags?: string[];
    languageFrom?: string;
    languageTo?: string;
  } | null;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function StudyFlashcard({ item, onNext, onPrevious }: StudyFlashcardProps) {
  const [isFront, setIsFront] = useState(true);

  // --- Fallback de seguridad (se mantiene del original) ---
  if (!item) {
    return (
      <div className="text-center text-muted py-12">
        No hay tarjetas disponibles.
      </div>
    );
  }

  const handleFlip = () => setIsFront((prev) => !prev);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 pb-8 space-y-6">
        {/* ---------------- HEADER ---------------- */}
        <CardHeader
          left={
            <div className="flex flex-wrap gap-2">
              {(item.tags ?? []).map((t, i) => (
                <Chip key={t + i} accent={i === 0}>
                  {t}
                </Chip>
              ))}
            </div>
          }
          right={
            <span className="text-muted uppercase tracking-[0.16em] text-[12px]">
              {isFront ? item.languageFrom ?? "Alemán" : item.languageTo ?? "Español"}
            </span>
          }
        />

        {/* ---------------- BODY ---------------- */}
        <CardBody>
          <SideLabel>
            {isFront ? "LADO A · ALEMÁN" : "LADO B · ESPAÑOL"}
          </SideLabel>

          <Word side={isFront ? "a" : "b"}>
            {isFront ? item.word : item.translation}
          </Word>

          {/* Metadata visible solo en lado B */}
          {!isFront && (
            <div className="text-soft text-[13px] mt-4 flex flex-col gap-1">
              {item.gender && (
                <div>
                  <strong>Género:</strong> {item.gender}
                </div>
              )}
              {item.plural && (
                <div>
                  <strong>Plural:</strong> {item.plural}
                </div>
              )}
              {item.note && <div>{item.note}</div>}
            </div>
          )}
        </CardBody>

        {/* ---------------- FOOTER ---------------- */}
        <CardFooter className="flex flex-col items-center gap-4 w-full">
          <PrimaryButton
            onClick={handleFlip}
            className="w-full max-w-[400px] mx-auto"
          >
            {isFront ? "Ver respuesta y detalles" : "Volver al lado A"}
          </PrimaryButton>

          <div className="flex justify-center gap-2">
            {onPrevious && (
              <SecondaryButton onClick={onPrevious} className="py-2 px-4">
                Anterior
              </SecondaryButton>
            )}
            {onNext && (
              <SecondaryButton onClick={onNext} className="py-2 px-4">
                Siguiente
              </SecondaryButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
