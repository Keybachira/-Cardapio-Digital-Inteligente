"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { CATEGORIAS, RESTAURANTE } from "@/lib/mock-data";
import { Categoria } from "@/lib/types";
import { criarPedido, formatoKz, useCardapio, useCarrinho } from "@/lib/store";

export default function MenuClient({
  mesaId,
  numeroMesa,
}: {
  mesaId: string;
  numeroMesa: number;
}) {
  const router = useRouter();
  const { pratos } = useCardapio();
  const { itens, adicionar, remover, limpar } = useCarrinho(mesaId);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("entradas");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const disponiveis = useMemo(
    () => pratos.filter((p) => p.disponivel),
    [pratos]
  );

  const pratosCategoria = disponiveis.filter(
    (p) => p.categoria === categoriaAtiva
  );

  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0);
  const totalValor = itens.reduce((s, i) => {
    const prato = pratos.find((p) => p.id === i.pratoId);
    return s + (prato?.preco ?? 0) * i.quantidade;
  }, 0);

  function quantidadeDe(pratoId: string) {
    return itens.find((i) => i.pratoId === pratoId)?.quantidade ?? 0;
  }

  async function enviarPedido() {
    if (itens.length === 0) return;
    setEnviando(true);
    criarPedido(mesaId, itens);
    limpar();
    setTimeout(() => {
      router.push(`/conta/${mesaId}`);
    }, 400);
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[var(--ink)]/90 border-b border-[var(--line)]">
        <div className="max-w-2xl mx-auto px-5 pt-5 pb-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--bone-dim)]">
              Mesa {String(numeroMesa).padStart(2, "0")}
            </p>
            <h1 className="font-display text-3xl text-[var(--bone)] leading-none mt-1">
              {RESTAURANTE.nome}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-display italic text-sm text-[var(--ember-2)]">
              {RESTAURANTE.subnome}
            </p>
          </div>
        </div>
        {/* Category tabs */}
        <nav className="max-w-2xl mx-auto px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaAtiva(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium border transition-colors ${
                categoriaAtiva === c.id
                  ? "bg-[var(--ember)] border-[var(--ember)] text-[var(--ink)]"
                  : "border-[var(--line-strong)] text-[var(--bone-dim)]"
              }`}
            >
              {c.nome}
            </button>
          ))}
        </nav>
      </header>

      {/* Category intro */}
      <div className="max-w-2xl mx-auto px-5 pt-6">
        {CATEGORIAS.find((c) => c.id === categoriaAtiva)?.descricao ? (
          <p className="text-[var(--bone-dim)] text-sm mb-4 font-display italic text-lg">
            {CATEGORIAS.find((c) => c.id === categoriaAtiva)?.descricao}
          </p>
        ) : null}
      </div>

      {/* Dish list */}
      <div className="max-w-2xl mx-auto px-5 flex flex-col divide-y divide-[var(--line)]">
        {pratosCategoria.map((prato) => {
          const qtd = quantidadeDe(prato.id);
          return (
            <div key={prato.id} className="py-5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-[var(--bone)]">
                    {prato.nome}
                  </h3>
                  {prato.destaque && (
                    <Flame
                      size={14}
                      className="text-[var(--ember-2)] shrink-0"
                      strokeWidth={2}
                    />
                  )}
                  {prato.picante && (
                    <span className="text-[10px] font-mono text-[var(--ember-2)] border border-[var(--ember)]/40 rounded px-1">
                      picante
                    </span>
                  )}
                </div>
                {prato.descricao && (
                  <p className="text-[13px] text-[var(--bone-dim)] mt-1 leading-relaxed pr-2">
                    {prato.descricao}
                  </p>
                )}
                <p className="font-mono text-[var(--gold)] text-sm mt-2">
                  {formatoKz(prato.preco)}
                </p>
              </div>
              <div className="shrink-0 self-center">
                {qtd === 0 ? (
                  <button
                    onClick={() => adicionar(prato.id)}
                    aria-label={`Adicionar ${prato.nome}`}
                    className="w-10 h-10 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--bone)] hover:border-[var(--ember)] hover:text-[var(--ember-2)] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-full border border-[var(--ember)] px-1 py-1">
                    <button
                      onClick={() => remover(prato.id)}
                      aria-label={`Remover ${prato.nome}`}
                      className="w-8 h-8 flex items-center justify-center text-[var(--ember-2)]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-mono text-sm text-[var(--bone)] w-4 text-center">
                      {qtd}
                    </span>
                    <button
                      onClick={() => adicionar(prato.id)}
                      aria-label={`Adicionar ${prato.nome}`}
                      className="w-8 h-8 flex items-center justify-center text-[var(--ember-2)]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {pratosCategoria.length === 0 && (
          <p className="py-10 text-center text-[var(--bone-dim)] text-sm">
            Sem pratos disponíveis nesta categoria neste momento.
          </p>
        )}
      </div>

      {/* Sticky cart bar */}
      {totalItens > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-5 pt-3">
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="max-w-2xl mx-auto w-full flex items-center justify-between rounded-full bg-[var(--ember)] text-[var(--ink)] px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)] font-semibold"
          >
            <span className="flex items-center gap-2 text-sm">
              <ShoppingBag size={18} />
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </span>
            <span className="font-mono text-sm">{formatoKz(totalValor)}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCarrinhoAberto(false)}
          />
          <div className="relative w-full sm:max-w-md bg-[var(--ink-2)] border-t sm:border border-[var(--line)] sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--ink-2)] flex items-center justify-between px-6 py-5 border-b border-[var(--line)]">
              <h2 className="font-display text-xl text-[var(--bone)]">
                O teu pedido
              </h2>
              <button
                onClick={() => setCarrinhoAberto(false)}
                className="text-[var(--bone-dim)]"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-4">
              {itens.map((item) => {
                const prato = pratos.find((p) => p.id === item.pratoId);
                if (!prato) return null;
                return (
                  <div key={item.pratoId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-[var(--bone)] text-sm">{prato.nome}</p>
                      <p className="font-mono text-xs text-[var(--gold)]">
                        {formatoKz(prato.preco)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-1 py-1">
                      <button
                        onClick={() => remover(item.pratoId)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--bone-dim)]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-mono text-xs text-[var(--bone)] w-3 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => adicionar(item.pratoId)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--bone-dim)]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-5 border-t border-[var(--line)] sticky bottom-0 bg-[var(--ink-2)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--bone-dim)] text-sm">Total</span>
                <span className="font-mono text-lg text-[var(--bone)]">
                  {formatoKz(totalValor)}
                </span>
              </div>
              <button
                onClick={enviarPedido}
                disabled={enviando}
                className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-4 text-sm disabled:opacity-60"
              >
                {enviando ? "A enviar para a cozinha…" : "Enviar pedido à cozinha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
