"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ExternalLink, LayoutGrid, UtensilsCrossed } from "lucide-react";
import { RESTAURANTE } from "@/lib/mock-data";

const LINKS = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/admin/mesas", label: "Mesas", icon: LayoutGrid },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col sm:flex-row" style={{ background: "var(--ink)" }}>
      <aside className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--line)] px-5 py-6 flex sm:flex-col justify-between sm:justify-start gap-6 sm:gap-10">
        <div>
          <p className="font-display text-xl text-[var(--bone)] leading-none">
            {RESTAURANTE.nome}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--bone-dim)] mt-1">
            Painel
          </p>
        </div>
        <nav className="flex sm:flex-col gap-1">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--ember)] text-[var(--ink)] font-semibold"
                    : "text-[var(--bone-dim)] hover:text-[var(--bone)]"
                }`}
              >
                <Icon size={16} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="hidden sm:flex mt-auto items-center gap-1.5 text-[var(--bone-dim)] text-xs font-mono hover:text-[var(--bone)]"
        >
          <ExternalLink size={13} />
          Ver mesas de demo
        </Link>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
