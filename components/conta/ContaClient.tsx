"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChefHat, Clock, Flame, Receipt, Smartphone } from "lucide-react";
import { RESTAURANTE } from "@/lib/mock-data";
import { formatoKz, usePedidos } from "@/lib/store";
import { EstadoPedido } from "@/lib/types";

const ESTADO_INFO: Record<
  EstadoPedido,
  { label: string; icon: typeof Clock; cor: string }
> = {
  novo: { label: "Recebido pela cozinha", icon: Receipt, cor: "var(--bone-dim)" },
  preparo: { label: "Em preparação", icon: ChefHat, cor: "var(--ember-2)" },
  pronto: { label: "Pronto a servir", icon: Flame, cor: "var(--ember)" },
  entregue: { label: "Servido", icon: CheckCircle2, cor: "#7fbf8f" },
};

export default function ContaClient({
  mesaId,
  numeroMesa,
}: {
  mesaId: string;
  numeroMesa: number;
}) {
  const pedidos = usePedidos(mesaId);
  const [pagamento, setPagamento] = useState<"idle" | "processando" | "pago">(
    "idle"
  );
  const [chamou, setChamou] = useState(false);

  const total = useMemo(
    () => pedidos.reduce((s, p) => s + p.total, 0),
    [pedidos]
  );

  function pagarAgora() {
    setPagamento("processando");
    setTimeout(() => setPagamento("pago"), 1600);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      <header className="max-w-xl mx-auto px-5 pt-10 pb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--bone-dim)]">
          Mesa {String(numeroMesa).padStart(2, "0")} · {RESTAURANTE.nome}
        </p>
        <h1 className="font-display text-3xl text-[var(--bone)] mt-2">
          A tua conta, em tempo real
        </h1>
        <p className="text-[var(--bone-dim)] text-sm mt-2">
          Sem folha, sem esperar pelo garçom para saber o que já pediste.
        </p>
      </header>

      <div className="max-w-xl mx-auto px-5 pb-24">
        {pedidos.length === 0 ? (
          <p className="text-center text-[var(--bone-dim)] text-sm py-16">
            Ainda não há pedidos nesta mesa.{" "}
            <Link
              href={`/menu/${mesaId}`}
              className="text-[var(--ember-2)] underline"
            >
              Ver o cardápio
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {pedidos.map((pedido) => {
              const info = ESTADO_INFO[pedido.estado];
              const Icon = info.icon;
              return (
                <div key={pedido.id} className="ticket font-mono text-[13px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="uppercase tracking-widest text-[11px] text-[var(--ink)]/60">
                      Pedido #{pedido.id.slice(-5)}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-[11px] font-semibold"
                      style={{ color: info.cor }}
                    >
                      <Icon size={13} />
                      {info.label}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-[var(--ink)]/20 pt-3 flex flex-col gap-1.5">
                    {pedido.itens.map((item) => (
                      <div key={item.pratoId} className="flex justify-between">
                        <span>
                          {item.quantidade}× {item.nome}
                        </span>
                        <span>{formatoKz(item.preco * item.quantidade)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-[var(--ink)]/20 mt-3 pt-3 flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>{formatoKz(pedido.total)}</span>
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-2)] px-6 py-6 flex items-center justify-between">
              <span className="text-[var(--bone-dim)] text-sm">
                Total da mesa
              </span>
              <span className="font-mono text-2xl text-[var(--bone)]">
                {formatoKz(total)}
              </span>
            </div>

            {pagamento === "pago" ? (
              <div className="rounded-2xl bg-[#193226] border border-[#2f5940] px-6 py-6 text-center">
                <CheckCircle2 className="mx-auto mb-2 text-[#7fbf8f]" size={28} />
                <p className="text-[var(--bone)] font-medium">
                  Pagamento confirmado
                </p>
                <p className="text-[var(--bone-dim)] text-xs mt-1">
                  Obrigado pela visita à {RESTAURANTE.nome}.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={pagarAgora}
                  disabled={pagamento === "processando"}
                  className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Smartphone size={16} />
                  {pagamento === "processando"
                    ? "A processar via Multicaixa Express…"
                    : "Pagar agora pelo telemóvel"}
                </button>
                <button
                  onClick={() => setChamou(true)}
                  disabled={chamou}
                  className="w-full rounded-full border border-[var(--line-strong)] text-[var(--bone)] font-medium py-4 text-sm disabled:opacity-60"
                >
                  {chamou
                    ? "Garçom a caminho para fechar a conta"
                    : "Prefiro pagar no balcão"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
