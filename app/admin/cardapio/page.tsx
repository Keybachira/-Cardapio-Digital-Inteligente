"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Flame,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIAS } from "@/lib/mock-data";
import { Categoria, Prato } from "@/lib/types";
import { formatoKz, useCardapioAdmin } from "@/lib/admin-store";

const CAT_EMOJI: Record<Categoria, string> = {
  entradas: "🥗",
  brasa: "🔥",
  mar: "🐟",
  acompanhamentos: "🍚",
  sobremesas: "🍰",
  bebidas: "🥤",
};

function novoPratoVazio(): Prato {
  return {
    id: `p-${Date.now()}`,
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "entradas",
    disponivel: true,
  };
}

export default function CardapioPage() {
  const { pratos, salvarPrato, alternarDisponibilidade, removerPrato } =
    useCardapioAdmin();
  const [novo, setNovo] = useState<Prato | null>(null);

  function confirmarNovo() {
    if (!novo || !novo.nome.trim() || novo.preco <= 0) return;
    salvarPrato(novo);
    setNovo(null);
  }

  return (
    <div className="min-h-screen noise" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-[var(--ink)]/85 border-b border-[var(--line)]">
        <div className="px-6 sm:px-8 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame size={22} className="text-[var(--ember-2)] shrink-0" />
            <div>
              <h1 className="font-display text-xl text-[var(--bone)] leading-none">
                Cardápio
              </h1>
              <p className="text-[var(--bone-dim)] text-xs mt-0.5">
                Ativa, desativa ou adiciona pratos do dia.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNovo(novoPratoVazio())}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-[var(--ember)] text-[var(--ink)] text-sm font-semibold px-4 py-2.5 hover:bg-[var(--ember-2)] transition-colors"
          >
            <Plus size={15} />
            Novo prato
          </button>
        </div>
      </header>

      <div className="px-6 sm:px-8 py-6 max-w-3xl">
        {/* Novo prato form */}
        {novo && (
          <div className="rounded-xl border border-[var(--ember)] bg-[var(--ink-2)] p-5 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-[var(--bone)] flex items-center gap-2">
                <ImagePlus size={18} className="text-[var(--ember-2)]" />
                Adicionar prato
              </h2>
              <button
                onClick={() => setNovo(null)}
                className="text-[var(--bone-dim)] hover:text-[var(--bone)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Nome do prato"
                value={novo.nome}
                onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
                className="rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] transition-colors"
              />
              <input
                type="number"
                placeholder="Preço (Kz)"
                value={novo.preco || ""}
                onChange={(e) =>
                  setNovo({ ...novo, preco: Number(e.target.value) })
                }
                className="rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] transition-colors"
              />
            </div>
            <textarea
              placeholder="Descrição (opcional)"
              value={novo.descricao}
              onChange={(e) => setNovo({ ...novo, descricao: e.target.value })}
              rows={2}
              className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] transition-colors mb-3"
            />
            <select
              value={novo.categoria}
              onChange={(e) =>
                setNovo({ ...novo, categoria: e.target.value as Categoria })
              }
              className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] transition-colors mb-4"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {CAT_EMOJI[c.id]} {c.nome}
                </option>
              ))}
            </select>
            <button
              onClick={confirmarNovo}
              className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-2.5 text-sm hover:bg-[var(--ember-2)] transition-colors"
            >
              Adicionar ao cardápio
            </button>
          </div>
        )}

        {/* Lista por categoria */}
        <div className="flex flex-col gap-8">
          {CATEGORIAS.map((cat) => {
            const doCat = pratos.filter((p) => p.categoria === cat.id);
            if (doCat.length === 0) return null;
            return (
              <div key={cat.id}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--bone-dim)] mb-3 flex items-center gap-2">
                  <span>{CAT_EMOJI[cat.id]}</span>
                  {cat.nome}
                  <span className="font-mono text-[10px] text-[var(--bone-dim)]/60">
                    ({doCat.length})
                  </span>
                </h2>
                <div className="flex flex-col border border-[var(--line)] rounded-xl overflow-hidden">
                  {doCat.map((prato, i) => (
                    <div
                      key={prato.id}
                      className={`flex items-center gap-4 px-4 py-3.5 ${
                        i !== doCat.length - 1
                          ? "border-b border-[var(--line)]"
                          : ""
                      }`}
                    >
                      {/* Imagem thumbnail */}
                      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-[var(--ink)]">
                        {prato.imagem ? (
                          <img
                            src={prato.imagem}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            {CAT_EMOJI[prato.categoria]}
                          </div>
                        )}
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => alternarDisponibilidade(prato.id)}
                        aria-label="Alternar disponibilidade"
                        className={`shrink-0 w-10 h-6 rounded-full relative transition-colors ${
                          prato.disponivel
                            ? "bg-[var(--ember)]"
                            : "bg-[var(--line-strong)]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-[var(--ink)] transition-transform ${
                            prato.disponivel
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-sm ${
                              prato.disponivel
                                ? "text-[var(--bone)]"
                                : "text-[var(--bone-dim)] line-through"
                            }`}
                          >
                            {prato.nome}
                          </p>
                          {prato.destaque && (
                            <Flame
                              size={12}
                              className="text-[var(--ember-2)] shrink-0"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--bone-dim)]">
                          <span>{formatoKz(prato.preco)}</span>
                          {!prato.disponivel && (
                            <span className="flex items-center gap-0.5">
                              <EyeOff size={10} /> oculto
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {prato.disponivel ? (
                          <Eye
                            size={14}
                            className="text-[var(--bone-dim)]/40"
                          />
                        ) : (
                          <EyeOff
                            size={14}
                            className="text-[var(--bone-dim)]/40"
                          />
                        )}
                        <button
                          onClick={() => removerPrato(prato.id)}
                          aria-label="Remover prato"
                          className="shrink-0 text-[var(--bone-dim)] hover:text-[var(--ember)] transition-colors ml-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
