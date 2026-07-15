"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  LayoutGrid,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";
import { MESAS, RESTAURANTE } from "@/lib/mock-data";
import { logout } from "@/lib/auth";
import { gerarCodigoMesa } from "@/lib/daily-code";

const LINKS = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/admin/mesas", label: "Mesas", icon: LayoutGrid },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const codigosHoje = useMemo(
    () => MESAS.map((m) => ({ mesa: m, codigo: gerarCodigoMesa(m.id) })),
    []
  );

  return (
    <aside className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--line)] px-5 py-6 flex sm:flex-col justify-between sm:justify-start gap-6 sm:gap-10">
      {/* Logo + título */}
      <div className="flex items-center gap-3">
        <svg
          width={28}
          height={28}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M4 22q4-6 8 0t8 0 8 0 8 0"
            stroke="var(--ember)"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 6c-2 6-6 8-6 12a6 6 0 1 0 12 0c0-4-4-6-6-12z"
            fill="var(--gold)"
            opacity={0.85}
          />
          <circle cx={20} cy={19} r={2} fill="var(--bone)" opacity={0.9} />
        </svg>
        <div>
          <p className="font-display text-[17px] text-[var(--bone)] leading-none">
            {RESTAURANTE.nome}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bone-dim)] mt-0.5">
            Painel
          </p>
        </div>
      </div>

      {/* Navegação */}
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

      {/* Códigos do dia */}
      <div className="border-t border-[var(--line)] pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bone-dim)] mb-2">
          Códigos de hoje
        </p>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1.5">
          {codigosHoje.slice(0, 12).map(({ mesa, codigo }) => (
            <div key={mesa.id} className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[var(--bone-dim)] w-5">
                {String(mesa.numero).padStart(2, "0")}
              </span>
              <span className="font-mono text-[11px] tracking-wider text-[var(--gold)]">
                {codigo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="hidden sm:flex flex-col mt-auto gap-2">
        <a
          href="http://kianda.ao"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[var(--bone-dim)] text-xs font-mono hover:text-[var(--bone)] transition-colors"
        >
          <ExternalLink size={13} />
          kianda.ao
        </a>
        <button
          onClick={() => {
            logout();
            router.push("/admin");
          }}
          className="flex items-center gap-1.5 text-[var(--bone-dim)] text-xs font-mono hover:text-red-400 transition-colors"
        >
          <LogOut size={13} />
          Sair
        </button>
      </div>
    </aside>
  );
}
