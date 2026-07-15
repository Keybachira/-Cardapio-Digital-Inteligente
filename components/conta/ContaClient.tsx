"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  KeyRound,
  Lock,
  Receipt,
  Smartphone,
  ChevronLeft,
  ScrollText,
  UtensilsCrossed,
  BellRing,
} from "lucide-react";
import { RESTAURANTE } from "@/lib/mock-data";
import {
  chamarGarcom,
  formatoKz,
  marcarMesaComoPaga,
  mesaEstaPaga,
  usePedidos,
} from "@/lib/store";
import { EstadoPedido } from "@/lib/types";
import { validarCodigoMesa } from "@/lib/daily-code";

const KEY_ACESSO = (mid: string) => `kianda:acesso:${mid}`;

function jaVerificou(mesaId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(KEY_ACESSO(mesaId));
  if (!raw) return false;
  return Date.now() - Number(raw) < 4 * 60 * 60 * 1000;
}

function marcarVerificado(mesaId: string) {
  sessionStorage.setItem(KEY_ACESSO(mesaId), String(Date.now()));
}

const ESTADO_INFO: Record<
  EstadoPedido,
  { label: string; icon: typeof Clock; cor: string }
> = {
  novo: {
    label: "Recebido pela cozinha",
    icon: Receipt,
    cor: "var(--bone-dim)",
  },
  preparo: { label: "Em preparação", icon: ChefHat, cor: "var(--ember-2)" },
  pronto: { label: "Pronto a servir", icon: Flame, cor: "var(--ember)" },
  entregue: { label: "Servido", icon: CheckCircle2, cor: "#7fbf8f" },
};

export default function ContaClient({
  mesaId,
  numeroMesa,
  codigoInicial,
}: {
  mesaId: string;
  numeroMesa: number;
  codigoInicial?: string;
}) {
  const pedidos = usePedidos(mesaId);
  const [chamou, setChamou] = useState(false);
  const [tab, setTab] = useState<"conta" | "menu">("conta");

  const [codigoInput, setCodigoInput] = useState("");
  const [erroCodigo, setErroCodigo] = useState("");

  const [acessoLiberado, setAcessoLiberado] = useState(
    () =>
      jaVerificou(mesaId) ||
      (!!codigoInicial && validarCodigoMesa(mesaId, codigoInicial))
  );

  if (acessoLiberado && codigoInicial && !jaVerificou(mesaId)) {
    marcarVerificado(mesaId);
  }

  const total = useMemo(
    () => pedidos.reduce((s, p) => s + p.total, 0),
    [pedidos]
  );

  const paga = mesaEstaPaga(mesaId);

  function tentarAcesso() {
    if (validarCodigoMesa(mesaId, codigoInput)) {
      marcarVerificado(mesaId);
      setAcessoLiberado(true);
      setErroCodigo("");
    } else {
      setErroCodigo("Código inválido. Verifica o QR da mesa.");
    }
  }

  // ---------- Access gate ----------
  if (!acessoLiberado) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 noise"
        style={{
          background:
            "radial-gradient(130% 100% at 50% -15%, var(--ocean-2) 0%, var(--ocean) 35%, var(--ink) 70%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          <svg
            width={48}
            height={48}
            viewBox="0 0 40 40"
            fill="none"
            className="mx-auto mb-5"
            aria-hidden="true"
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
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-2)]/80 px-8 py-9 text-center backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <KeyRound
                size={28}
                className="mx-auto mb-3 text-[var(--ember-2)]"
                style={{
                  animation: "float 3s ease-in-out infinite",
                }}
              />
              <h1 className="font-display text-2xl text-[var(--bone)] mb-1">
                Mesa {String(numeroMesa).padStart(2, "0")}
              </h1>
              <p className="text-[var(--bone-dim)] text-sm mb-6">
                Introduce o código de acesso para ver a conta.
              </p>
            </motion.div>
            <input
              value={codigoInput}
              onChange={(e) => {
                setCodigoInput(e.target.value.toUpperCase());
                setErroCodigo("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") tentarAcesso();
              }}
              placeholder="CÓDIGO"
              maxLength={4}
              className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3.5 py-3 text-center text-2xl font-mono tracking-[0.3em] text-[var(--bone)] mb-4 outline-none focus:border-[var(--ember)] focus:ring-1 focus:ring-[var(--ember)]/30 uppercase transition-all"
              autoFocus
            />
            <AnimatePresence>
              {erroCodigo && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs font-mono mb-4"
                >
                  {erroCodigo}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              onClick={tentarAcesso}
              className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-3 text-sm hover:bg-[var(--ember-2)] transition-colors"
            >
              Ver conta
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // ---------- Content ----------
  return (
    <div
      className="min-h-screen noise flex flex-col"
      style={{ background: "var(--ink)" }}
    >
      {/* Glass header */}
      <header className="glass-header sticky top-0 z-20 border-b border-[var(--line)]">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/menu/${mesaId}`}
              className="flex items-center gap-1.5 text-[var(--bone-dim)] hover:text-[var(--bone)] transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Mesa {String(numeroMesa).padStart(2, "0")}
              </span>
            </Link>
          </div>
          <span className="font-display text-lg text-[var(--bone)]">Conta</span>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 pt-6 pb-28">
        {pedidos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Receipt
              size={40}
              className="mx-auto mb-4 text-[var(--bone-dim)]/40"
            />
            <p className="text-[var(--bone-dim)] text-sm mb-6">
              Ainda não há pedidos nesta mesa.
            </p>
            <Link
              href={`/menu/${mesaId}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold px-6 py-3 text-sm hover:bg-[var(--ember-2)] transition-colors"
            >
              <ChefHat size={16} />
              Ver o cardápio
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
            className="flex flex-col gap-4"
          >
            {pedidos.map((pedido) => {
              const info = ESTADO_INFO[pedido.estado];
              const Icon = info.icon;
              return (
                <motion.div
                  key={pedido.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)] px-5 py-4 font-mono text-[13px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="uppercase tracking-widest text-[10px] text-[var(--bone-dim)]">
                      Pedido #{pedido.id.slice(-5)}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {pedido.pagoEm && (
                        <span className="flex items-center gap-1 text-[10px] text-[#7fbf8f] font-semibold">
                          <Lock size={10} />
                          Pago
                        </span>
                      )}
                      <span
                        className="flex items-center gap-1 text-[11px] font-semibold"
                        style={{ color: info.cor }}
                      >
                        <Icon size={12} />
                        {info.label}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-[var(--line)] pt-3 flex flex-col gap-1.5">
                    {pedido.itens.map((item) => (
                      <div key={item.pratoId} className="flex justify-between">
                        <span className="text-[var(--bone)]">
                          {item.quantidade}&times; {item.nome}
                        </span>
                        <span className="text-[var(--gold)]">
                          {formatoKz(item.preco * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-[var(--line)] mt-3 pt-3 flex justify-between font-semibold">
                    <span className="text-[var(--bone-dim)]">Subtotal</span>
                    <span className="text-[var(--bone)]">
                      {formatoKz(pedido.total)}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Total card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4 },
                },
              }}
              className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)] px-5 py-5 flex items-center justify-between"
            >
              <div>
                <span className="text-[var(--bone-dim)] text-sm block">
                  Total da mesa
                </span>
                {paga && (
                  <span className="text-[#7fbf8f] font-mono text-[11px] flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} />
                    Liquidada
                  </span>
                )}
              </div>
              <span className="font-mono text-2xl text-[var(--bone)]">
                {formatoKz(total)}
              </span>
            </motion.div>

            {/* Paid / Actions */}
            {paga ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="rounded-xl border border-[#2f5940] bg-[#193226] px-5 py-8 text-center"
              >
                <CheckCircle2
                  className="mx-auto mb-3 text-[#7fbf8f]"
                  size={36}
                />
                <p className="text-[var(--bone)] font-display text-xl">
                  Conta liquidada
                </p>
                <p className="text-[var(--bone-dim)] text-sm mt-1">
                  Obrigado pela visita &agrave; {RESTAURANTE.nome}.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1, duration: 0.4 },
                  },
                }}
                className="flex flex-col gap-3"
              >
                <button
                  onClick={() => marcarMesaComoPaga(mesaId)}
                  className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-4 text-sm flex items-center justify-center gap-2 hover:bg-[var(--ember-2)] transition-colors"
                >
                  <Smartphone size={16} />
                  Marcar como pago
                </button>
                <button
                  onClick={() => {
                    setChamou(true);
                    chamarGarcom(mesaId, numeroMesa, "conta");
                  }}
                  disabled={chamou}
                  className="w-full rounded-full border border-[var(--line-strong)] text-[var(--bone)] font-medium py-4 text-sm disabled:opacity-60 hover:border-[var(--bone-dim)]/50 transition-colors"
                >
                  {chamou
                    ? "Garçom a caminho"
                    : "Prefiro pagar no balcão"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <div className="max-w-xl mx-auto px-5 h-full flex items-center justify-around">
          <Link
            href={`/menu/${mesaId}`}
            className="bottom-nav-btn flex-col"
          >
            <UtensilsCrossed size={20} />
            <span>Cardápio</span>
          </Link>
          <button
            onClick={() => setTab("conta")}
            className={`bottom-nav-btn flex-col ${tab === "conta" ? "active" : ""}`}
          >
            <ScrollText size={20} />
            <span>Conta</span>
          </button>
          <button
            onClick={() => chamarGarcom(mesaId, numeroMesa, "ajuda")}
            className="bottom-nav-btn flex-col"
          >
            <BellRing size={20} />
            <span>Garçom</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
