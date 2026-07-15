"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { CATEGORIAS } from "@/lib/mock-data";
import { Categoria, Prato } from "@/lib/types";
import { formatoKz, useCardapio } from "@/lib/store";

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
    useCardapio();
  const [novo, setNovo] = useState<Prato | null>(null);

  function confirmarNovo() {
    if (!novo || !novo.nome.trim() || novo.preco <= 0) return;
    salvarPrato(novo);
    setNovo(null);
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-[var(--bone)]">Cardápio</h1>
          <p className="text-[var(--bone-dim)] text-sm mt-1">
            Ativa, desativa ou adiciona pratos do dia — o cliente vê a mudança
            no telemóvel na mesma hora.
          </p>
        </div>
        <button
          onClick={() => setNovo(novoPratoVazio())}
          className="shrink-0 flex items-center gap-1.5 rounded-full bg-[var(--ember)] text-[var(--ink)] text-sm font-semibold px-4 py-2.5 hover:bg-[var(--ember-2)] transition-colors"
        >
          <Plus size={15} />
          Novo prato
        </button>
      </div>

      {novo && (
        <div className="rounded-xl border border-[var(--ember)] bg-[var(--ink-2)] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-[var(--bone)]">
              Adicionar prato
            </h2>
            <button onClick={() => setNovo(null)} className="text-[var(--bone-dim)]">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Nome do prato"
              value={novo.nome}
              onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
              className="rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)]"
            />
            <input
              type="number"
              placeholder="Preço (Kz)"
              value={novo.preco || ""}
              onChange={(e) =>
                setNovo({ ...novo, preco: Number(e.target.value) })
              }
              className="rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)]"
            />
          </div>
          <textarea
            placeholder="Descrição (opcional)"
            value={novo.descricao}
            onChange={(e) => setNovo({ ...novo, descricao: e.target.value })}
            rows={2}
            className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] mb-3"
          />
          <select
            value={novo.categoria}
            onChange={(e) =>
              setNovo({ ...novo, categoria: e.target.value as Categoria })
            }
            className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3 py-2.5 text-sm text-[var(--bone)] outline-none focus:border-[var(--ember)] mb-4"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
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

      <div className="flex flex-col gap-8">
        {CATEGORIAS.map((cat) => {
          const doCat = pratos.filter((p) => p.categoria === cat.id);
          if (doCat.length === 0) return null;
          return (
            <div key={cat.id}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--bone-dim)] mb-3">
                {cat.nome}
              </h2>
              <div className="flex flex-col divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                {doCat.map((prato) => (
                  <div
                    key={prato.id}
                    className="py-3.5 flex items-center gap-4"
                  >
                    <button
                      onClick={() => alternarDisponibilidade(prato.id)}
                      aria-label="Alternar disponibilidade"
                      className={`shrink-0 w-10 h-6 rounded-full relative transition-colors ${
                        prato.disponivel ? "bg-[var(--ember)]" : "bg-[var(--line-strong)]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-[var(--ink)] transition-transform ${
                          prato.disponivel ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          prato.disponivel
                            ? "text-[var(--bone)]"
                            : "text-[var(--bone-dim)] line-through"
                        }`}
                      >
                        {prato.nome}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--gold)] shrink-0">
                      {formatoKz(prato.preco)}
                    </span>
                    <button
                      onClick={() => removerPrato(prato.id)}
                      aria-label="Remover prato"
                      className="shrink-0 text-[var(--bone-dim)] hover:text-[var(--ember)]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
