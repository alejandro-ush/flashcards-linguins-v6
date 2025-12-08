// src/components/ui/Word.tsx

export function Word({
  children,
  side = "a"
}: {
  children: React.ReactNode;
  side?: "a" | "b";
}) {
  return (
    <div
      className={`
        font-bold
        text-[clamp(44px,5vw,56px)]
        tracking-[0.02em]
        ${side === "a" ? "text-white" : "text-accentMintSoft"}
      `}
    >
      {children}
    </div>
  );
}
