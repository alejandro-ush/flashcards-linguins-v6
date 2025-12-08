// File: src/components/ui/CardFooter.tsx

import type { ReactNode } from "react";

type CardFooterProps = {
  children: ReactNode;
  className?: string;
};

export function CardFooter({ children, className }: CardFooterProps) {
  const base =
    "mt-6 flex flex-col items-center gap-3"; // mismas clases que veníamos usando

  return (
    <div className={className ? `${base} ${className}` : base}>
      {children}
    </div>
  );
}
