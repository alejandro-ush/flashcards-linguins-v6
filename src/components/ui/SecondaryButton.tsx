// src/components/ui/SecondaryButton.tsx

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="
        px-4 py-2
        rounded-pill
        border border-[rgba(148,163,184,0.35)]
        bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.96),rgba(15,23,42,1))]
        text-[13px] text-textSoft
        hover:opacity-90 transition
      "
    >
      {children}
    </button>
  );
}
