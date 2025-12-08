// src/components/ui/SecondaryButton.tsx

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function SecondaryButton({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        `
        px-6
        py-2.5
        rounded-full
        border border-slate-600/50
        text-slate-200
        text-sm
        hover:bg-slate-700/30
        transition
        `,
        className
      )}
    >
      {children}
    </button>
  );
}
