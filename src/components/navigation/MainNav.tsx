/* src/components/navigation/MainNav.tsx */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study", label: "Reto" },
  { href: "/feedback", label: "Feedback" },
  { href: "/explore", label: "Explore" },
  { href: "/quickburst", label: "QuickBurst" },
  { href: "/voice", label: "Voice" },
  { href: "/tribe", label: "Tribe" },
  { href: "/profile", label: "Perfil" }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-2 text-xs md:flex">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-3 py-1.5 text-[11px] ${
              active
                ? "border-teal-400/70 bg-teal-400/10 text-teal-200"
                : "border-slate-800 text-slate-300 hover:bg-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
