// src/components/study/StudyModeTabs.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/study/flashcard", label: "Flashcards" },
  { href: "/study/writing", label: "Writing" },
  { href: "/study/mc", label: "Multiple Choice" }
];

export function StudyModeTabs() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-slate-800 px-1 py-1 text-xs">
      {tabs.map((tab) => {
        const active =
          pathname === tab.href ||
          pathname.startsWith(tab.href + "/");

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              "px-3 py-1.5 rounded-full transition " +
              (active
                ? "bg-primary text-black font-medium"
                : "text-slate-300 hover:bg-slate-800")
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
