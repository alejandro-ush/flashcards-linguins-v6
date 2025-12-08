// src/components/ui/PrimaryButton.tsx

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        `
        w-full
        rounded-full
        bg-gradient-to-r from-emerald-400 to-emerald-500
        text-black
        font-semibold
        text-lg
        py-4
        transition
        hover:opacity-90
        shadow-[0_0_20px_rgba(16,185,129,0.25)]
        `,
        className
      )}
    >
      {children}
    </button>
  );
}
