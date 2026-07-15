"use client";

import { EstadoPedido, Pedido } from "@/lib/types";
import {
  atualizarEstadoPedido,
  formatoKz,
  usePedidosAdmin,
} from "@/lib/admin-store";
import { MESAS } from "@/lib/mock-data";
import { ArrowRight, ChefHat, Clock } from "lucide-react";

const COLUNAS: {
  estado: EstadoPedido;
  titulo: string;
  proximo?: EstadoPedido;
  acao?: string;
}[] = [
  { estado: "novo", titulo: "Novo", proximo: "preparo", acao: "Iniciar preparo" },
  {
    estado: "preparo",
    titulo: "Em preparo",
    proximo: "pronto",
    acao: "Marcar pronto",
  },
  { estado: "pronto", titulo: "Pronto", proximo: "entregue", acao: "Marcar servido" },
  { estado: "entregue", titulo: "Servido" },
];

function numeroMesa(mesaId: string) {
  return MESAS.find((m) => m.id === mesaId)?.numero ?? "?";
}

function tempoDecorrido(desde: number) {
  const min = Math.max(0, Math.floor((Date.now() - desde) / 60000));
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h}h${min % 60}`;
}

export default function PedidosPage() {
  const pedidos = usePedidosAdmin();

  return (
    <div className="min-h-screen noise" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-[var(--ink)]/85 border-b border-[var(--line)]">
        <div className="px-6 sm:px-8 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat size={22} className="text-[var(--ember-2)] shrink-0" />
            <div>
              <h1 className="font-display text-xl text-[var(--bone)] leading-none">
                Pedidos
              </h1>
              <p className="text-[var(--bone-dim)] text-xs mt-0.5">
                Atualiza sozinho quando um cliente envia um pedido.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--bone-dim)] border border-[var(--line-strong)] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fbf8f] animate-pulse" />
            ao vivo
          </span>
        </div>
      </header>

      {/* Columns */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUNAS.map((col) => {
          const doColuna = pedidos
            .filter((p) => p.estado === col.estado)
            .sort((a, b) => a.criadoEm - b.criadoEm);
          return (
            <div key={col.estado} className="min-w-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--bone-dim)]">
                  {col.titulo}
                </h2>
                <span className="font-mono text-[11px] text-[var(--bone-dim)]">
                  {doColuna.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {doColuna.map((p: Pedido, i) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)] p-4 animate-fade-in-up text-[13px]"
                    style={{ animationDelay: `${0.03 * i}s` }}
                  >
                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-display text-lg text-[var(--bone)]">
                        Mesa {numeroMesa(p.mesaId)}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--bone-dim)]">
                        <Clock size={11} />
                        {tempoDecorrido(p.criadoEm)}
                      </span>
                    </div>

                    {/* Itens */}
                    <ul className="flex flex-col gap-1 mb-3">
                      {p.itens.map((item) => (
                        <li
                          key={item.pratoId}
                          className="text-[var(--bone-dim)] flex justify-between"
                        >
                          <span>
                            {item.quantidade}× {item.nome}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Total */}
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--gold)] mb-3 pt-2 border-t border-[var(--line)]">
                      <span>Total</span>
                      <span>{formatoKz(p.total)}</span>
                    </div>

                    {/* Ação */}
                    {col.proximo && (
                      <button
                        onClick={() =>
                          atualizarEstadoPedido(
                            p.id,
                            col.proximo as EstadoPedido
                          )
                        }
                        className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[var(--ember)] text-[var(--ink)] text-xs font-semibold py-2.5 hover:bg-[var(--ember-2)] transition-colors"
                      >
                        {col.acao}
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {doColuna.length === 0 && (
                  <p className="text-[var(--bone-dim)]/40 text-xs font-mono px-1">
                    — vazio —
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
