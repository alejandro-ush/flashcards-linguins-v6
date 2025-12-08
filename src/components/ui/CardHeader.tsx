//src/components/ui/CardHeader.tsx

export function CardHeader({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {left}
      {right && <div className="text-[12px] tracking-[0.16em] uppercase text-textMuted">{right}</div>}
    </div>
  );
}
