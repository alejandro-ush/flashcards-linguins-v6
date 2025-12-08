//src/components/ui/Card.tsx

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        rounded-4xl
        p-6 pb-7
        border border-cardBorder
        shadow-card
        bg-[radial-gradient(circle_at_top_left,rgba(44,227,155,0.08),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.8),rgba(2,6,23,0.98))]
        backdrop-blur-strong
        flex flex-col gap-6
      "
    >
      {children}
    </div>
  );
}
