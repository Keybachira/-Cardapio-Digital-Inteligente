"use client";

import { useEffect, useState } from "react";
import { EstadoPedido, Pedido } from "@/lib/types";
import { atualizarEstadoPedido, formatoKz, usePedidos } from "@/lib/store";
import { MESAS } from "@/lib/mock-data";
import { ArrowRight, Clock } from "lucide-react";

const COLUNAS: { estado: EstadoPedido; titulo: string; proximo?: EstadoPedido; acao?: string }[] = [
  { estado: "novo", titulo: "Novo", proximo: "preparo", acao: "Iniciar preparo" },
  { estado: "preparo", titulo: "Em preparo", proximo: "pronto", acao: "Marcar pronto" },
  { estado: "pronto", titulo: "Pronto", proximo: "entregue", acao: "Marcar servido" },
  { estado: "entregue", titulo: "Servido" },
];

function numeroMesa(mesaId: string) {
  return MESAS.find((m) => m.id === mesaId)?.numero ?? "?";
}

function tempoDecorrido(desde: number, agora: number) {
  const min = Math.max(0, Math.floor((agora - desde) / 60000));
  if (min < 1) return "agora mesmo";
  return `${min} min`;
}

export default function PedidosPage() {
  const pedidos = usePedidos();
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-[var(--bone)]">Pedidos</h1>
          <p className="text-[var(--bone-dim)] text-sm mt-1">
            Atualiza sozinho quando um cliente envia um pedido — experimenta
            fazer um pedido noutra aba.
          </p>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--bone-dim)] border border-[var(--line-strong)] rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fbf8f] animate-pulse" />
          ao vivo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {doColuna.map((p: Pedido) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-lg text-[var(--bone)]">
                        Mesa {numeroMesa(p.mesaId)}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--bone-dim)]">
                        <Clock size={11} />
                        {tempoDecorrido(p.criadoEm, agora)}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1 mb-3">
                      {p.itens.map((item) => (
                        <li
                          key={item.pratoId}
                          className="text-[13px] text-[var(--bone-dim)] flex justify-between"
                        >
                          <span>
                            {item.quantidade}× {item.nome}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--gold)] mb-3">
                      <span>Total</span>
                      <span>{formatoKz(p.total)}</span>
                    </div>
                    {col.proximo && (
                      <button
                        onClick={() =>
                          atualizarEstadoPedido(p.id, col.proximo as EstadoPedido)
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
                  <p className="text-[var(--bone-dim)]/50 text-xs font-mono px-1">
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
