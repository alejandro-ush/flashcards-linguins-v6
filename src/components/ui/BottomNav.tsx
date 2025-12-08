// src/components/ui/BottomNav.tsx

export function BottomNav({ tabs }: { tabs: { label: string; active?: boolean }[] }) {
  return (
    <div
      className="
        w-full max-w-[520px]
        mx-auto mt-2
        flex justify-between gap-2
        rounded-pill
        p-2
        border border-[rgba(30,64,175,0.55)]
        bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]
        backdrop-blur-soft
      "
    >
      {tabs.map((t, i) => (
        <div
          key={i}
          className={`
            flex-1 text-center py-2 rounded-pill text-[13px]
            ${t.active
              ? "bg-[radial-gradient(circle_at_top,rgba(44,227,155,0.16),rgba(15,23,42,0.96))] text-accentMintSoft"
              : "text-textMuted"
            }
          `}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
