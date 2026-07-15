"use client";

import Link from "next/link";
import { MESAS } from "@/lib/mock-data";
import { formatoKz, limparPedidosMesa, usePedidos } from "@/lib/store";

export default function MesasPage() {
  const todosPedidos = usePedidos();

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl text-[var(--bone)] mb-1">Mesas</h1>
      <p className="text-[var(--bone-dim)] text-sm mb-6">
        Visão geral de ocupação e consumo por mesa.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MESAS.map((mesa) => {
          const pedidosMesa = todosPedidos.filter((p) => p.mesaId === mesa.id);
          const total = pedidosMesa.reduce((s, p) => s + p.total, 0);
          const ocupada = pedidosMesa.length > 0;
          const pendente = pedidosMesa.some(
            (p) => p.estado === "novo" || p.estado === "preparo"
          );

          return (
            <div
              key={mesa.id}
              className={`rounded-xl border p-4 ${
                ocupada
                  ? "border-[var(--ember)]/50 bg-[var(--ink-2)]"
                  : "border-[var(--line)] bg-[var(--ink-2)]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-2xl text-[var(--bone)]">
                  {String(mesa.numero).padStart(2, "0")}
                </span>
                {ocupada ? (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pendente ? "bg-[var(--ember)] animate-pulse" : "bg-[#7fbf8f]"
                    }`}
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                )}
              </div>
              <p className="font-mono text-xs text-[var(--bone-dim)] mb-3">
                {ocupada ? `${pedidosMesa.length} pedido(s)` : "Livre"}
              </p>
              <p className="font-mono text-sm text-[var(--gold)] mb-4">
                {formatoKz(total)}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/conta/${mesa.id}`}
                  className="text-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] text-xs py-2 hover:border-[var(--ember)] transition-colors"
                >
                  Ver conta
                </Link>
                {ocupada && (
                  <button
                    onClick={() => limparPedidosMesa(mesa.id)}
                    className="rounded-full bg-[var(--ember)]/10 text-[var(--ember-2)] text-xs py-2 hover:bg-[var(--ember)]/20 transition-colors"
                  >
                    Fechar mesa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
