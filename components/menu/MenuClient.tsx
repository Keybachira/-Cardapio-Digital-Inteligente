"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Flame,
  KeyRound,
  MapPin,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  X,
  ChefHat,
  Bell,

} from "lucide-react";
import { CATEGORIAS, RESTAURANTE } from "@/lib/mock-data";
import { Categoria, Prato } from "@/lib/types";
import {
  chamarGarcom,
  criarPedido,
  formatoKz,
  mesaEstaPaga,
  useCardapio,
  useCarrinho,
} from "@/lib/store";
import { gerarCodigoMesa, validarCodigoMesa } from "@/lib/daily-code";
import CategoryChips from "./CategoryChips";
import PromoBanner from "./PromoBanner";
import DishDetailModal from "./DishDetailModal";

const KEY_ACESSO = (mid: string) => `kianda:acesso:${mid}`;

function jaVerificou(mesaId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(KEY_ACESSO(mesaId));
  if (!raw) return false;
  const expirado = Date.now() - Number(raw) > 4 * 60 * 60 * 1000;
  if (expirado) {
    sessionStorage.removeItem(KEY_ACESSO(mesaId));
    return false;
  }
  return true;
}

function marcarVerificado(mesaId: string) {
  sessionStorage.setItem(KEY_ACESSO(mesaId), String(Date.now()));
}

const CAT_EMOJI: Record<Categoria, string> = {
  entradas: "🥗",
  brasa: "🔥",
  mar: "🐟",
  acompanhamentos: "🍚",
  sobremesas: "🍰",
  bebidas: "🥤",
};

// ---- Animation variants ----
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 } as const,
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } } as const,
};

export default function MenuClient({
  mesaId,
  numeroMesa,
  codigoInicial,
}: {
  mesaId: string;
  numeroMesa: number;
  codigoInicial?: string;
}) {
  const router = useRouter();
  const { pratos } = useCardapio();
  const { itens, adicionar, remover, atualizarNotas, limpar } = useCarrinho(mesaId);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("entradas");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");
  const [erroCodigo, setErroCodigo] = useState("");
  const [aba, setAba] = useState<"home" | "menu">("home");
  const [buscaQuery, setBuscaQuery] = useState("");
  const [pratoDetalhe, setPratoDetalhe] = useState<Prato | null>(null);
  const buscaRef = useRef<HTMLInputElement>(null);

  const [acessoLiberado, setAcessoLiberado] = useState(
    () =>
      jaVerificou(mesaId) ||
      (!!codigoInicial && validarCodigoMesa(mesaId, codigoInicial))
  );

  if (acessoLiberado && codigoInicial && !jaVerificou(mesaId)) {
    marcarVerificado(mesaId);
  }

  const disponiveis = useMemo(() => pratos.filter((p) => p.disponivel), [pratos]);
  const emDestaque = useMemo(() => disponiveis.filter((p) => p.destaque), [disponiveis]);

  const buscaFiltrada = useMemo(() => {
    if (!buscaQuery.trim()) return null;
    const q = buscaQuery.toLowerCase();
    return disponiveis.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q)
    );
  }, [buscaQuery, disponiveis]);

  const pratosCategoria = buscaFiltrada ?? disponiveis.filter(
    (p) => p.categoria === categoriaAtiva
  );

  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0);
  const totalValor = itens.reduce((s, i) => {
    const prato = pratos.find((p) => p.id === i.pratoId);
    return s + (prato?.preco ?? 0) * i.quantidade;
  }, 0);

  function tentarAcesso() {
    if (validarCodigoMesa(mesaId, codigoInput)) {
      marcarVerificado(mesaId);
      setAcessoLiberado(true);
      setErroCodigo("");
    } else {
      setErroCodigo("Código inválido. Verifica o QR da mesa.");
    }
  }

  function quantidadeDe(pratoId: string) {
    return itens.find((i) => i.pratoId === pratoId)?.quantidade ?? 0;
  }

  function obterNotas(pratoId: string) {
    return itens.find((i) => i.pratoId === pratoId)?.notas ?? "";
  }

  async function enviarPedido() {
    if (itens.length === 0) return;
    setEnviando(true);
    criarPedido(mesaId, itens);
    limpar();
    const codigo = sessionStorage.getItem(KEY_ACESSO(mesaId))
      ? undefined
      : codigoInicial;
    const codigoFinal = codigo ?? gerarCodigoMesa(mesaId);
    setTimeout(() => {
      router.push(`/conta/${mesaId}?codigo=${codigoFinal}`);
    }, 600);
  }

  // ---------- Access gate ----------
  if (!acessoLiberado) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 noise"
        style={{
          background:
            "radial-gradient(130% 100% at 50% -15%, #1a4740 0%, #0d241b 35%, #071812 70%)",
        }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Logo */}
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
              stroke="#e86b25"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M20 6c-2 6-6 8-6 12a6 6 0 1 0 12 0c0-4-4-6-6-12z"
              fill="#d4af57"
              opacity={0.85}
            />
            <circle cx={20} cy={19} r={2} fill="#f5e8cf" opacity={0.9} />
          </svg>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-2)]/80 px-8 py-9 text-center backdrop-blur-sm">
            <motion.div
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <KeyRound size={28} className="mx-auto mb-3 text-[var(--ember)]" />
            </motion.div>
            <h1 className="font-display text-2xl text-[var(--bone)] mb-1">
              Mesa {String(numeroMesa).padStart(2, "0")}
            </h1>
            <p className="text-[var(--bone-dim)] text-sm mb-6">
              Introduce o código de acesso que está no QR da mesa.
            </p>
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
            {erroCodigo && (
              <motion.p
                className="text-red-400 text-xs font-mono mb-4"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {erroCodigo}
              </motion.p>
            )}
            <button
              onClick={tentarAcesso}
              className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-3 text-sm hover:bg-[var(--ember-2)] transition-colors"
            >
              Entrar no cardápio
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // ---------- Home screen ----------
  if (aba === "home") {
    return (
      <div className="min-h-screen noise" style={{ background: "var(--ink)" }}>
        {/* Cover */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={RESTAURANTE.coverImage}
            alt={RESTAURANTE.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071812] via-[#071812]/50 to-transparent" />

          {/* Mesa tag */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono text-[var(--bone)] border border-white/10">
              Mesa {String(numeroMesa).padStart(2, "0")}
            </span>
            <button
              onClick={() => setAba("menu")}
              className="rounded-full bg-[var(--ember)] text-[var(--ink)] px-4 py-1.5 text-[11px] font-semibold flex items-center gap-1"
            >
              <UtensilsCrossed size={12} />
              Cardápio
            </button>
          </div>

          {/* Call garçom */}
          <button
            className="absolute top-5 right-5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[11px] font-mono text-[var(--bone)] flex items-center gap-1.5 hover:bg-white/20 transition-colors"
            onClick={() => {
              chamarGarcom(mesaId, numeroMesa, "atencao");
            }}
          >
            <Bell size={12} />
            Chamar garçom
          </button>

          {/* Branding */}
          <div className="absolute bottom-6 left-5 right-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <svg
                width={36}
                height={36}
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 22q4-6 8 0t8 0 8 0 8 0"
                  stroke="#e86b25"
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M20 6c-2 6-6 8-6 12a6 6 0 1 0 12 0c0-4-4-6-6-12z"
                  fill="#d4af57"
                  opacity={0.85}
                />
                <circle
                  cx={20}
                  cy={19}
                  r={2}
                  fill="#f5e8cf"
                  opacity={0.9}
                />
              </svg>
              <h1 className="font-display text-3xl sm:text-4xl text-[var(--bone)] mt-2 leading-tight">
                {RESTAURANTE.nome}
              </h1>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)] mt-1">
                {RESTAURANTE.subnome}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Info bar */}
        <div className="px-5 py-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[var(--bone-dim)] border-b border-[var(--line)]">
          <span className="flex items-center gap-1.5">
            <Star size={13} className="text-[var(--gold)]" fill="var(--gold)" />
            {RESTAURANTE.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {RESTAURANTE.horario}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} />
            {RESTAURANTE.localizacao}
          </span>
        </div>

        {/* Tagline + CTA */}
        <div className="px-5 pt-8 pb-4 text-center">
          <motion.p
            className="font-display text-2xl text-[var(--bone)] leading-snug"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            &ldquo;{RESTAURANTE.tagline}&rdquo;
          </motion.p>
          <motion.button
            onClick={() => setAba("menu")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold px-8 py-3.5 text-sm hover:bg-[var(--ember-2)] transition-colors"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            whileTap={{ scale: 0.96 }}
          >
            <UtensilsCrossed size={16} />
            Explorar Menu
          </motion.button>
        </div>

        {/* Promo banner */}
        <div className="px-5 pt-8 pb-6">
          <PromoBanner
            prato={emDestaque[0]}
            onVerPrato={() => {
              if (emDestaque[0]) setPratoDetalhe(emDestaque[0]);
            }}
          />
        </div>

        {/* Featured / Mais Pedidos */}
        {emDestaque.length > 0 && (
          <div className="px-5 pb-28">
            <h2 className="font-display text-lg text-[var(--bone)] mb-4 flex items-center gap-2">
              <Flame size={18} className="text-[var(--ember)]" />
              Mais Pedidos
            </h2>
            <motion.div
              className="grid grid-cols-2 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {emDestaque.slice(0, 4).map((prato) => (
                <motion.div key={prato.id} variants={itemVariants}>
                  <button
                    onClick={() => setPratoDetalhe(prato)}
                    className="dish-card w-full text-left"
                  >
                    <div className="dish-card-img aspect-[4/3]">
                      {prato.imagem ? (
                        <img src={prato.imagem} alt={prato.nome} loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {CAT_EMOJI[prato.categoria]}
                        </div>
                      )}
                    </div>
                    <div className="dish-card-body">
                      <p className="dish-name truncate">
                        {prato.nome}
                      </p>
                      <p className="dish-price text-sm">
                        {formatoKz(prato.preco)}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          <button className="bottom-nav-btn active">
            <UtensilsCrossed size={20} />
            Menu
          </button>
          <button
            className="bottom-nav-btn"
            onClick={() => {
              setAba("menu");
              setTimeout(() => buscaRef.current?.focus(), 300);
            }}
          >
            <Search size={20} />
            Buscar
          </button>
          <button
            className="bottom-nav-btn relative"
            onClick={() => setCarrinhoAberto(true)}
          >
            <ShoppingBag size={20} />
            Pedido
            {totalItens > 0 && (
              <span className="bottom-nav-badge">{totalItens}</span>
            )}
          </button>
        </nav>

        {/* Cart drawer overlay */}
        <AnimatePresence>
          {carrinhoAberto && (
            <CartDrawer
              itens={itens}
              pratos={pratos}
              totalItens={totalItens}
              totalValor={totalValor}
              enviando={enviando}
              onFechar={() => setCarrinhoAberto(false)}
              onAdicionar={adicionar}
              onRemover={remover}
              onAtualizarNotas={atualizarNotas}
              onEnviarPedido={enviarPedido}
              onVerConta={() => {
                const c = sessionStorage.getItem(KEY_ACESSO(mesaId))
                  ? undefined
                  : codigoInicial;
                router.push(
                  `/conta/${mesaId}${c ? `?codigo=${c}` : ""}`
                );
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---------- Full menu view ----------
  return (
    <div className="min-h-screen noise" style={{ background: "var(--ink)" }}>
      {/* Sticky header */}
      <header className="glass-header sticky top-0 z-30">
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAba("home")}
              className="text-[var(--bone-dim)] hover:text-[var(--bone)] transition-colors"
              aria-label="Voltar ao início"
            >
              <ChefHat size={22} className="text-[var(--ember)]" />
            </button>
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--bone-dim)]">
                Mesa {String(numeroMesa).padStart(2, "0")}
              </p>
              <h1 className="font-display text-[17px] leading-none text-[var(--bone)]">
                {RESTAURANTE.nome}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const c = sessionStorage.getItem(KEY_ACESSO(mesaId))
                  ? undefined
                  : codigoInicial;
                router.push(
                  `/conta/${mesaId}${c ? `?codigo=${c}` : ""}`
                );
              }}
              className="flex items-center gap-1 rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[9px] font-mono text-[var(--bone-dim)] hover:text-[var(--bone)] hover:border-[var(--ember)] transition-all"
            >
              <Receipt size={11} />
              Conta
            </button>
            <button
              className="flex items-center gap-1 rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[9px] font-mono text-[var(--bone-dim)] hover:text-[var(--bone)] hover:border-[var(--ember)] transition-all"
              onClick={() => chamarGarcom(mesaId, numeroMesa, "atencao")}
              title="Chamar garçom"
            >
              <Bell size={11} />
              Garçom
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bone-dim)]"
            />
            <input
              ref={buscaRef}
              value={buscaQuery}
              onChange={(e) => setBuscaQuery(e.target.value)}
              placeholder="Buscar no cardápio…"
              className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line)] pl-9 pr-3 py-2 text-[12px] text-[var(--bone)] outline-none focus:border-[var(--ember)] placeholder:text-[var(--bone-dim)]/40 transition-colors"
            />
            {buscaQuery && (
              <button
                onClick={() => setBuscaQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bone-dim)]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        {!buscaQuery && (
          <div className="pb-3">
            <CategoryChips ativa={categoriaAtiva} onChange={setCategoriaAtiva} />
          </div>
        )}
      </header>

      {/* Paid banner */}
      {mesaEstaPaga(mesaId) && (
        <div className="bg-[#0f1f15] border-b border-[#2f5940] px-5 py-3 text-center">
          <p className="text-[#7fbf8f] text-xs font-mono flex items-center justify-center gap-1.5">
            <Receipt size={11} />
            Conta liquidada — podes continuar a pedir à vontade.
          </p>
        </div>
      )}

      {/* Category title */}
      {!buscaQuery && (
        <div className="px-5 pt-5 pb-1">
          {(() => {
            const cat = CATEGORIAS.find((c) => c.id === categoriaAtiva);
            return (
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{CAT_EMOJI[categoriaAtiva]}</span>
                <div>
                  <h2 className="font-display text-xl text-[var(--bone)]">
                    {cat?.nome}
                  </h2>
                  {cat?.descricao && (
                    <p className="text-[var(--bone-dim)] text-xs">
                      {cat.descricao}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Search results header */}
      {buscaFiltrada && (
        <div className="px-5 pt-5 pb-1">
          <p className="text-[var(--bone-dim)] text-xs font-mono">
            {buscaFiltrada.length} resultado{buscaFiltrada.length !== 1 ? "s" : ""} para &ldquo;{buscaQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Dish grid */}
      <div className="px-5 pt-4 pb-32 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {pratosCategoria.map((prato, i) => {
            const qtd = quantidadeDe(prato.id);
            const notas = obterNotas(prato.id);
            return (
              <motion.div
                key={prato.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.03 * i, duration: 0.35, ease: "easeOut" }}
              >
                <div className="dish-card" onClick={() => setPratoDetalhe(prato)}>
                  {/* Image */}
                  <div className="dish-card-img">
                    {prato.imagem ? (
                      <img
                        src={prato.imagem}
                        alt={prato.nome}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {CAT_EMOJI[prato.categoria]}
                      </div>
                    )}
                    {prato.picante && (
                      <span className="absolute top-2.5 right-2.5 bg-[var(--ember)] text-[var(--surface)] text-[8px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        picante
                      </span>
                    )}
                    {prato.destaque && (
                      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-mono font-semibold bg-[var(--surface)]/90 text-[var(--ember)] px-2 py-1 rounded-full shadow-sm">
                        <Flame size={10} />
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="dish-card-body">
                    <h3 className="dish-name">
                      {prato.nome}
                    </h3>
                    {prato.descricao && (
                      <p className="dish-desc line-clamp-2">
                        {prato.descricao}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="dish-price">
                        {formatoKz(prato.preco)}
                      </span>

                      {qtd === 0 ? (
                        <motion.button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); adicionar(prato.id); }}
                          aria-label={`Adicionar ${prato.nome}`}
                          className="w-9 h-9 rounded-full bg-[var(--ember)] flex items-center justify-center text-[var(--surface)] hover:bg-[var(--ember-2)] transition-colors shadow-sm"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Plus size={18} />
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1 rounded-full border border-[var(--ember)] bg-orange-50 px-1.5 py-1">
                          <motion.button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); remover(prato.id); }}
                          aria-label={`Remover ${prato.nome}`}
                            className="w-7 h-7 flex items-center justify-center text-[var(--ember)] hover:bg-[var(--ember)]/10 rounded-full transition-colors"
                            whileTap={{ scale: 0.85 }}
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="font-mono text-sm text-[var(--text-primary)] w-5 text-center font-medium">
                          {qtd}
                        </span>
                        <motion.button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); adicionar(prato.id); }}
                            aria-label={`Adicionar ${prato.nome}`}
                            className="w-7 h-7 flex items-center justify-center text-[var(--ember)] hover:bg-[var(--ember)]/10 rounded-full transition-colors"
                            whileTap={{ scale: 0.85 }}
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Notes field (when item is in cart) */}
                    {qtd > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <input
                          value={notas}
                          onChange={(e) =>
                            atualizarNotas(prato.id, e.target.value)
                          }
                          placeholder="Observação (ex: sem picante)"
                          maxLength={200}
                          className="w-full rounded-lg bg-[var(--surface-2)] border border-gray-200 px-3 py-2 text-[12px] text-[var(--text-primary)] outline-none focus:border-[var(--ember)] placeholder:text-[var(--text-secondary)]/50 transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {pratosCategoria.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-[var(--bone-dim)] text-sm">
              {buscaQuery
                ? "Nenhum prato encontrado."
                : "Sem pratos disponíveis nesta categoria de momento."}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button
          className="bottom-nav-btn"
          onClick={() => setAba("home")}
        >
          <UtensilsCrossed size={20} />
          Menu
        </button>
        <button
          className={`bottom-nav-btn ${buscaQuery ? "active" : ""}`}
          onClick={() => buscaRef.current?.focus()}
        >
          <Search size={20} />
          Buscar
        </button>
        <button
          className="bottom-nav-btn relative"
          onClick={() => setCarrinhoAberto(true)}
        >
          <ShoppingBag size={20} />
          Pedido
          {totalItens > 0 && (
            <span className="bottom-nav-badge">{totalItens}</span>
          )}
        </button>
      </nav>

      {/* Cart drawer */}
      <AnimatePresence>
        {carrinhoAberto && (
          <CartDrawer
            itens={itens}
            pratos={pratos}
            totalItens={totalItens}
            totalValor={totalValor}
            enviando={enviando}
            onFechar={() => setCarrinhoAberto(false)}
            onAdicionar={adicionar}
            onRemover={remover}
            onAtualizarNotas={atualizarNotas}
            onEnviarPedido={enviarPedido}
            onVerConta={() => {
              const c = sessionStorage.getItem(KEY_ACESSO(mesaId))
                ? undefined
                : codigoInicial;
              router.push(`/conta/${mesaId}${c ? `?codigo=${c}` : ""}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {pratoDetalhe && (
          <DishDetailModal
            prato={pratoDetalhe}
            quantidade={itens.find((i) => i.pratoId === pratoDetalhe.id)?.quantidade ?? 0}
            onAdicionar={() => adicionar(pratoDetalhe.id)}
            onRemover={() => remover(pratoDetalhe.id)}
            onAddToCart={() => setPratoDetalhe(null)}
            onFechar={() => setPratoDetalhe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Cart Drawer Component ----------
function CartDrawer({
  itens,
  pratos,
  totalItens,
  totalValor,
  enviando,
  onFechar,
  onAdicionar,
  onRemover,
  onAtualizarNotas,
  onEnviarPedido,
  onVerConta,
}: {
  itens: { pratoId: string; quantidade: number; notas?: string }[];
  pratos: { id: string; nome: string; preco: number; categoria: Categoria }[];
  totalItens: number;
  totalValor: number;
  enviando: boolean;
  onFechar: () => void;
  onAdicionar: (id: string) => void;
  onRemover: (id: string) => void;
  onAtualizarNotas: (id: string, notas: string) => void;
  onEnviarPedido: () => void;
  onVerConta: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onFechar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Drawer */}
      <motion.div
        className="relative w-full sm:max-w-md bg-[var(--ink-2)] border-t sm:border border-[var(--line)] sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--ink-2)] flex items-center justify-between px-6 py-5 border-b border-[var(--line)] z-10">
          <div>
            <h2 className="font-display text-xl text-[var(--bone)]">
              Seu Pedido
            </h2>
            <p className="font-mono text-[10px] text-[var(--bone-dim)]">
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-[var(--bone-dim)] hover:text-[var(--bone)] transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="px-6 py-4 flex flex-col gap-5">
          {itens.length === 0 && (
            <div className="text-center py-10">
              <ShoppingBag
                size={36}
                className="mx-auto mb-3 text-[var(--bone-dim)]/30"
              />
              <p className="text-[var(--bone-dim)] text-sm">
                Carrinho vazio.
              </p>
              <p className="text-[var(--bone-dim)]/60 text-xs mt-1">
                Adiciona pratos do cardápio.
              </p>
            </div>
          )}

          {itens.map((item) => {
            const prato = pratos.find((p) => p.id === item.pratoId);
            if (!prato) return null;
            const itemTotal = prato.preco * item.quantidade;
            return (
              <motion.div
                key={item.pratoId}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="pb-4 border-b border-[var(--line)] last:border-0"
              >
                {/* Qty + name + total */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--bone)] text-sm font-medium truncate">
                      {prato.nome}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--gold)] shrink-0 ml-3">
                    {formatoKz(itemTotal)}
                  </span>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-1.5 py-1">
                    <motion.button
                      onClick={() => onRemover(item.pratoId)}
                      className="w-7 h-7 flex items-center justify-center text-[var(--bone-dim)] hover:text-[var(--ember)] transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Minus size={14} />
                    </motion.button>
                    <span className="font-mono text-sm text-[var(--bone)] w-5 text-center">
                      {item.quantidade}
                    </span>
                    <motion.button
                      onClick={() => onAdicionar(item.pratoId)}
                      className="w-7 h-7 flex items-center justify-center text-[var(--bone-dim)] hover:text-[var(--ember)] transition-colors"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--bone-dim)]">
                    {formatoKz(prato.preco)} cada
                  </span>
                </div>

                {/* Notes */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2.5"
                >
                  <input
                    value={item.notas ?? ""}
                    onChange={(e) => onAtualizarNotas(item.pratoId, e.target.value)}
                    placeholder="Alguma observação?"
                    maxLength={200}
                    className="w-full rounded-md bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[11px] text-[var(--bone)] outline-none focus:border-[var(--ember)] placeholder:text-[var(--bone-dim)]/40 transition-colors"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--line)] sticky bottom-0 bg-[var(--ink-2)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--bone-dim)] text-sm">Total</span>
              <span className="font-mono text-xl text-[var(--bone)]">
                {formatoKz(totalValor)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onVerConta}
                className="rounded-full border border-[var(--line-strong)] text-[var(--bone-dim)] text-xs font-medium px-4 py-3 hover:border-[var(--ember)] hover:text-[var(--bone)] transition-colors"
              >
                Ver conta
              </button>
              <motion.button
                onClick={onEnviarPedido}
                disabled={enviando}
                className="flex-1 rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-3 text-sm hover:bg-[var(--ember-2)] transition-colors disabled:opacity-60"
                whileTap={{ scale: 0.97 }}
              >
                {enviando
                  ? "A enviar…"
                  : `Enviar pedido (${formatoKz(totalValor)})`}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
