// File: src/components/study/StudyFlashcard.tsx
// Flashcard PREMIUM v6.1 — versión optimizada final.

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { CardFooter } from "@/components/ui/CardFooter";
import { Chip } from "@/components/ui/Chip";
import { SideLabel } from "@/components/ui/SideLabel";
import { Word } from "@/components/ui/Word";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

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

  if (!item) {
    return (
      <div className="text-center text-slate-400 py-12">
        No hay tarjetas disponibles.
      </div>
    );
  }

  const flip = () => setIsFront((prev) => !prev);

  const tags = item.tags ?? [];
  const languageFrom = item.languageFrom ?? "Alemán";
  const languageTo = item.languageTo ?? "Español";
  const languageLabel = isFront ? languageFrom : languageTo;

  // Por ahora dejamos los labels fijos a DE/ES, alineado al mock v6.1
  const sideLabel = isFront ? "LADO A · ALEMÁN" : "LADO B · ESPAÑOL";

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader
          left={
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Chip key={`${tag}-${i}`} accent={i === 0}>
                  {tag}
                </Chip>
              ))}
            </div>
          }
          right={
            <span className="text-muted uppercase tracking-[0.16em] text-[12px]">
              {languageLabel}
            </span>
          }
        />

        <CardBody>
          <SideLabel>{sideLabel}</SideLabel>

          <Word side={isFront ? "a" : "b"}>
            {isFront ? item.word : item.translation}
          </Word>

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

        <CardFooter className="flex flex-col items-center gap-4 w-full">
          <PrimaryButton
            onClick={flip}
            className="w-full max-w-[400px] mx-auto"
          >
            {isFront ? "Ver respuesta y detalles" : "Volver al lado A"}
          </PrimaryButton>

          <div className="flex justify-center gap-2">
            {onPrevious && (
              <SecondaryButton className="py-2 px-4" onClick={onPrevious}>
                Anterior
              </SecondaryButton>
            )}
            {onNext && (
              <SecondaryButton className="py-2 px-4" onClick={onNext}>
                Siguiente
              </SecondaryButton>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}



/*
NO vamos a usar Item hasta que el endpoint /api/study/next esté finalizado.

Porque hoy Item NO representa todavía la tarjeta final.
Y eso es NORMAL: todavía no definimos qué devuelve el backend.


// File: src/components/study/StudyFlashcard.tsx
// Flashcard PREMIUM v6.1 — versión optimizada final.

"use client";

import { useState } from "react";
import type { Item } from "@/core/types";

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { CardFooter } from "@/components/ui/CardFooter";
import { Chip } from "@/components/ui/Chip";
import { SideLabel } from "@/components/ui/SideLabel";
import { Word } from "@/components/ui/Word";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export type StudyFlashcardProps = {
  item: Item | null;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function StudyFlashcard({ item, onNext, onPrevious }: StudyFlashcardProps) {
  const [isFront, setIsFront] = useState(true);

  // ---------------- FALLBACK ----------------
  if (!item) {
    return (
      <div className="text-center text-soft py-12">
        No hay tarjetas disponibles.
      </div>
    );
  }

  // ---------------- INTERACCIÓN ----------------
  const flip = () => setIsFront((prev) => !prev);

  // ---------------- LABELS ----------------
  const sideLabel = isFront ? "LADO A · ALEMÁN" : "LADO B · ESPAÑOL";
  const languageLabel = isFront
    ? item.languageFrom ?? "Alemán"
    : item.languageTo ?? "Español";

  const mainWord = isFront ? item.word : item.translation;

  return (
    <div className="max-w-3xl mx-auto px-2">
      <Card className="p-6 pb-8 space-y-6">
        
        <CardHeader //-------- HEADER --------
          left={
            <div className="flex flex-wrap gap-2">
              {(item.tags ?? []).map((tag, i) => (
                <Chip key={`${tag}-${i}`} accent={i === 0}>
                  {tag}
                </Chip>
              ))}
            </div>
          }
          right={
            <span className="text-muted uppercase tracking-[0.16em] text-[12px]">
              {languageLabel}
            </span>
          }
        />

        <CardBody>  // -------- BODY --------
          <SideLabel>{sideLabel}</SideLabel>

          <Word side={isFront ? "a" : "b"}>{mainWord}</Word>

          {!isFront && (
            <div className="text-soft text-[13px] mt-4 flex flex-col gap-1">
              {item.gender && (
                <div>
                  <span className="font-semibold">Género:</span> {item.gender}
                </div>
              )}
              {item.plural && (
                <div>
                  <span className="font-semibold">Plural:</span> {item.plural}
                </div>
              )}
              {item.note && <div>{item.note}</div>}
            </div>
          )}
        </CardBody>

        <CardFooter className="flex flex-col items-center gap-4 w-full">. //-------- FOOTER --------
          
          <PrimaryButton // Botón principal: flip
            onClick={flip}
            className="w-full max-w-[400px] mx-auto"
          >
            {isFront ? "Ver respuesta y detalles" : "Volver al lado A"}
          </PrimaryButton>

          <div className="flex justify-center gap-2">. // Navegación secundaria
            {onPrevious && (
              <SecondaryButton className="py-2 px-4" onClick={onPrevious}>
                Anterior
              </SecondaryButton>
            )}

            {onNext && (
              <SecondaryButton className="py-2 px-4" onClick={onNext}>
                Siguiente
              </SecondaryButton>
            )}
          </div>
        </CardFooter>

      </Card>
    </div>
  );
}

*/