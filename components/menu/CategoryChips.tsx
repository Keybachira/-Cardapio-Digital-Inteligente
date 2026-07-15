"use client";

import { Categoria } from "@/lib/types";

const CATEGORIAS: {
  id: Categoria;
  nome: string;
  emoji: string;
}[] = [
  { id: "entradas", nome: "Entradas", emoji: "🥗" },
  { id: "brasa", nome: "Da Brasa", emoji: "🔥" },
  { id: "mar", nome: "Do Mar", emoji: "🐟" },
  { id: "acompanhamentos", nome: "Acompanhamentos", emoji: "🍚" },
  { id: "sobremesas", nome: "Sobremesas", emoji: "🍰" },
  { id: "bebidas", nome: "Bebidas", emoji: "🥤" },
];

export default function CategoryChips({
  ativa,
  onChange,
}: {
  ativa: Categoria;
  onChange: (c: Categoria) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
      {CATEGORIAS.map((cat) => {
        const selected = cat.id === ativa;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                selected
                  ? "bg-[var(--ember)] shadow-md scale-105"
                  : "bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--bone-dim)]/30"
              }`}
            >
              {cat.emoji}
            </div>
            <span
              className={`font-mono text-[9px] uppercase tracking-wider whitespace-nowrap transition-colors ${
                selected ? "text-[var(--ember)] font-semibold" : "text-[var(--bone-dim)]"
              }`}
            >
              {cat.nome}
            </span>
          </button>
        );
      })}
    </div>
  );
}
