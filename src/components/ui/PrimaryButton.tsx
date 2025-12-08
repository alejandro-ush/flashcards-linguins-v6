// src/components/ui/PrimaryButton.tsx

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="
        w-full max-w-[420px]
        px-6 py-3
        rounded-pill
        font-semibold text-[15px]
        border border-[rgba(15,118,110,0.35)]
        bg-[linear-gradient(135deg,#2CE39B_0%,#25CF8C_60%,#1EBA77_100%)]
        text-deepGreen
        shadow-mint
        hover:opacity-90 transition
      "
    >
      {children}
    </button>
  );
}
