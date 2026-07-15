"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCheck,
  CreditCard,
  HelpCircle,
  UserRound,
} from "lucide-react";
import { removerChamada, useChamadas } from "@/lib/store";

const MOTIVO_META: Record<
  string,
  { label: string; icon: typeof Bell; cor: string }
> = {
  atencao: { label: "Precisa de atenção", icon: Bell, cor: "var(--ember)" },
  conta: {
    label: "Quer pagar no balcão",
    icon: CreditCard,
    cor: "var(--gold)",
  },
  ajuda: { label: "Precisa de ajuda", icon: HelpCircle, cor: "#7fbf8f" },
};

export default function GarcomPage() {
  const chamadas = useChamadas();

  return (
    <div
      className="min-h-screen noise flex flex-col"
      style={{ background: "var(--ink)" }}
    >
      {/* Header */}
      <header className="glass-header sticky top-0 z-20 border-b border-[var(--line)]">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserRound size={20} className="text-[var(--gold)]" />
            <div>
              <h1 className="font-display text-lg text-[var(--bone)] leading-none">
                Garçom
              </h1>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--bone-dim)]">
                {chamadas.length > 0
                  ? `${chamadas.length} chamada${chamadas.length > 1 ? "s" : ""} pendente${chamadas.length > 1 ? "s" : ""}`
                  : "Nenhuma chamada pendente"}
              </p>
            </div>
          </div>
          {chamadas.length > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--ember)]/15 text-[var(--ember)] px-3 py-1 text-[10px] font-mono font-semibold">
              <BellRing size={12} />
              AO VIVO
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 pt-6 pb-12">
        <AnimatePresence mode="popLayout">
          {chamadas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <CheckCheck
                size={48}
                className="mx-auto mb-4 text-[#2f5940]"
              />
              <p className="text-[var(--bone-dim)] text-sm">
                Todas as mesas estão atendidas.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="flex flex-col gap-3"
            >
              {chamadas.map((chamada, i) => {
                const meta = MOTIVO_META[chamada.motivo] ?? MOTIVO_META.ajuda;
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={chamada.mesaId}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.03 * i, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)] px-5 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-display text-lg"
                        style={{
                          background: `${meta.cor}18`,
                          color: meta.cor,
                        }}
                      >
                        {String(chamada.mesaNumero).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="text-[var(--bone)] font-display text-base leading-tight">
                          Mesa {chamada.mesaNumero}
                        </p>
                        <p
                          className="font-mono text-[11px] flex items-center gap-1 mt-0.5"
                          style={{ color: meta.cor }}
                        >
                          <Icon size={11} />
                          {meta.label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerChamada(chamada.mesaId)}
                      className="rounded-full border border-[var(--line-strong)] hover:border-[#7fbf8f] hover:text-[#7fbf8f] text-[var(--bone-dim)] px-3 py-1.5 text-[10px] font-mono transition-all"
                    >
                      Atender
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
