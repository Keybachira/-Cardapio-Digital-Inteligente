"use client";

import Link from "next/link";
import {
  Banknote,
  LayoutGrid,
  Lock,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { MESAS } from "@/lib/mock-data";
import {
  formatoKz,
  limparPedidosMesa,
  reabrirMesa,
  usePedidosAdmin,
} from "@/lib/admin-store";
import { marcarMesaComoPaga, mesaEstaPaga } from "@/lib/store";

export default function MesasPage() {
  const todosPedidos = usePedidosAdmin();

  return (
    <div className="min-h-screen noise" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-[var(--ink)]/85 border-b border-[var(--line)]">
        <div className="px-6 sm:px-8 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid size={22} className="text-[var(--ember-2)] shrink-0" />
            <div>
              <h1 className="font-display text-xl text-[var(--bone)] leading-none">
                Mesas
              </h1>
              <p className="text-[var(--bone-dim)] text-xs mt-0.5">
                Ocupação, consumo e pagamento por mesa.
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-[var(--bone-dim)]">
            {MESAS.length} mesas
          </span>
        </div>
      </header>

      <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MESAS.map((mesa, i) => {
          const pedidosMesa = todosPedidos.filter((p) => p.mesaId === mesa.id);
          const total = pedidosMesa.reduce((s, p) => s + p.total, 0);
          const ocupada = pedidosMesa.length > 0;
          const pendente = pedidosMesa.some(
            (p) => p.estado === "novo" || p.estado === "preparo"
          );
          const paga = mesaEstaPaga(mesa.id);
          const emDividade = ocupada && !paga;

          return (
            <div
              key={mesa.id}
              className={`rounded-xl border p-4 animate-fade-in-up ${
                paga
                  ? "border-[#2f5940]/60 bg-[#0f1f15]"
                  : emDividade
                  ? "border-[var(--ember)]/50 bg-[var(--ink-2)]"
                  : "border-[var(--line)] bg-[var(--ink-2)]/50"
              }`}
              style={{ animationDelay: `${0.03 * i}s` }}
            >
              {/* Cabeçalho */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-2xl text-[var(--bone)]">
                  {String(mesa.numero).padStart(2, "0")}
                </span>
                {paga ? (
                  <Lock size={14} className="text-[#7fbf8f]" />
                ) : emDividade ? (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pendente
                        ? "bg-[var(--ember)] animate-pulse"
                        : "bg-[var(--ember-2)]"
                    }`}
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                )}
              </div>

              {/* Estado */}
              <p className="font-mono text-xs text-[var(--bone-dim)] mb-3">
                {paga
                  ? "Liquidada"
                  : emDividade
                  ? `${pedidosMesa.length} pedido(s) · ${
                      pedidosMesa.filter((p) => !p.pagoEm).length
                    } por pagar`
                  : "Livre"}
              </p>

              {/* Total */}
              <p
                className={`font-mono text-sm mb-4 ${
                  paga ? "text-[#7fbf8f]" : "text-[var(--gold)]"
                }`}
              >
                {formatoKz(total)}
              </p>

              {/* Ações */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/conta/${mesa.id}`}
                  className="text-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] text-xs py-2 hover:border-[var(--ember)] transition-colors"
                >
                  Ver conta
                </Link>
                {emDividade && (
                  <button
                    onClick={() => marcarMesaComoPaga(mesa.id)}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[#7fbf8f]/15 text-[#7fbf8f] text-xs py-2 hover:bg-[#7fbf8f]/25 transition-colors"
                  >
                    <Banknote size={13} />
                    Liquidar conta
                  </button>
                )}
                {paga && (
                  <button
                    onClick={() => reabrirMesa(mesa.id)}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-[var(--line-strong)] text-[var(--bone-dim)] text-xs py-2 hover:text-[var(--bone)] hover:border-[var(--ember)] transition-colors"
                  >
                    <RotateCcw size={12} />
                    Reabrir mesa
                  </button>
                )}
                {ocupada && (
                  <button
                    onClick={() => limparPedidosMesa(mesa.id)}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--ember)]/10 text-[var(--ember-2)] text-xs py-2 hover:bg-[var(--ember)]/20 transition-colors"
                  >
                    <Trash2 size={12} />
                    Limpar tudo
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
