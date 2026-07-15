"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, X, Flame } from "lucide-react";
import { Prato, Categoria } from "@/lib/types";
import { formatoKz } from "@/lib/store";

const CAT_EMOJI: Record<Categoria, string> = {
  entradas: "🥗",
  brasa: "🔥",
  mar: "🐟",
  acompanhamentos: "🍚",
  sobremesas: "🍰",
  bebidas: "🥤",
};

export default function DishDetailModal({
  prato,
  quantidade,
  onFechar,
  onAdicionar,
  onRemover,
  onAddToCart,
}: {
  prato: Prato;
  quantidade: number;
  onFechar: () => void;
  onAdicionar: () => void;
  onRemover: () => void;
  onAddToCart: () => void;
}) {
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<number | null>(
    prato.variacoes ? 0 : null
  );

  const precoFinal = prato.variacoes?.[variacaoSelecionada ?? 0]?.preco ?? prato.preco;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onFechar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative w-full sm:max-w-md bg-[var(--surface)] rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] overflow-y-auto shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full-bleed image */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[var(--ocean)] to-[var(--ink-2)]">
          {prato.imagem ? (
            <img
              src={prato.imagem}
              alt={prato.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {CAT_EMOJI[prato.categoria]}
            </div>
          )}

          {/* Gradient overlay at bottom for price pill */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onFechar}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Price pill */}
          <div className="absolute bottom-4 left-4 rounded-full bg-[var(--ember)] text-[var(--surface)] font-mono font-bold text-lg px-5 py-2 shadow-lg">
            {formatoKz(precoFinal)}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6">
          {/* Name + info */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-2xl text-[var(--text-primary)] leading-tight">
                {prato.nome}
              </h2>
              {prato.picante && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[12px] font-mono text-[var(--ember)] font-semibold">
                  <Flame size={13} />
                  Picante
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {prato.descricao && (
            <div className="mb-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                Descrição
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                {prato.descricao}
              </p>
            </div>
          )}

          {/* Variations (tamanho, ponto, complementos) */}
          {prato.variacoes && prato.variacoes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-3">
                Opções
              </h3>
              <div className="flex flex-col gap-2">
                {prato.variacoes.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariacaoSelecionada(i)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      variacaoSelecionada === i
                        ? "border-[var(--ember)] bg-orange-50"
                        : "border-gray-200 bg-[var(--surface)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          variacaoSelecionada === i
                            ? "border-[var(--ember)]"
                            : "border-gray-300"
                        }`}
                      >
                        {variacaoSelecionada === i && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--ember)]" />
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          variacaoSelecionada === i
                            ? "text-[var(--text-primary)] font-medium"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {v.nome}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-[var(--ember)] font-medium">
                      {v.preco > 0 ? `+${formatoKz(v.preco)}` : "Grátis"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom bar: qty stepper + add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1.5">
              <motion.button
                onClick={onRemover}
                className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ember)] rounded-full hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.85 }}
              >
                <Minus size={16} />
              </motion.button>
              <span className="font-mono text-lg text-[var(--text-primary)] font-semibold w-8 text-center">
                {quantidade}
              </span>
              <motion.button
                onClick={onAdicionar}
                className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--ember)] rounded-full hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.85 }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
            <motion.button
              onClick={onAddToCart}
              className="flex-1 rounded-full bg-[var(--ember)] text-[var(--surface)] font-semibold py-3.5 text-sm hover:bg-[var(--ember-2)] transition-colors shadow-sm"
              whileTap={{ scale: 0.97 }}
            >
              {quantidade > 0 ? "Adicionar mais" : "Adicionar ao pedido"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
