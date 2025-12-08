// src/components/ui/SideLabel.tsx

export function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] tracking-[0.2em] uppercase text-textMuted">
      {children}
    </div>
  );
}
