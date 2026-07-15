"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Prato } from "@/lib/types";

export default function PromoBanner({
  prato,
  onVerPrato,
}: {
  prato?: Prato;
  onVerPrato?: () => void;
}) {
  if (!prato) {
    return (
      <div
        className="rounded-[20px] px-6 py-7 text-white overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #ff6a00 0%, #e8390b 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={14} />
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">
              Destaque
            </span>
          </div>
          <p className="font-display text-xl leading-tight mb-1">
            Pratos grelhados no carvão
          </p>
          <p className="text-sm opacity-80 mb-4">
            Do grelhador para a tua mesa
          </p>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-black/25 text-white text-sm font-medium px-5 py-2.5 backdrop-blur-sm hover:bg-black/35 transition-colors">
            Ver cardápio
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[20px] px-6 py-7 text-white overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #ff6a00 0%, #e8390b 100%)",
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={14} />
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">
            Destaque do dia
          </span>
        </div>
        <p className="font-display text-2xl leading-tight mb-1">
          {prato.nome}
        </p>
        <p className="text-sm opacity-80 mb-4 line-clamp-1">
          {prato.descricao || "Do grelhador para a tua mesa"}
        </p>
        <motion.button
          onClick={onVerPrato}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/25 text-white text-sm font-medium px-5 py-2.5 backdrop-blur-sm hover:bg-black/35 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          Ver prato
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}
