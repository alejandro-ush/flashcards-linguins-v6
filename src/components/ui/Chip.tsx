// src/components/ui/Chip.tsx

export function Chip({
  children,
  accent = false
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`
        px-[11px] py-[5px]
        text-[11px]
        rounded-pill border
        ${accent
          ? "border-[rgba(44,227,155,0.55)] text-accentMintSoft bg-[radial-gradient(circle_at_top,rgba(44,227,155,0.16),rgba(15,23,42,0.95))]"
          : "border-[rgba(148,163,184,0.35)] text-textSoft bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),rgba(15,23,42,0.9))]"
        }
      `}
    >
      {children}
    </div>
  );
}
