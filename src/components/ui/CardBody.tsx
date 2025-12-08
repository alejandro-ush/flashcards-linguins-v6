// src/components/ui/CardBody.tsx

export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 px-3 pt-4 pb-2">
      {children}
    </div>
  );
}
