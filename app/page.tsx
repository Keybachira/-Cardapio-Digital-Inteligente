import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { MESAS, RESTAURANTE } from "@/lib/mock-data";
import { ArrowUpRight, Waves } from "lucide-react";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, var(--ocean-2) 0%, var(--ocean) 32%, var(--ink) 68%)",
      }}
    >
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <div className="flex items-center justify-center gap-2 text-[13px] tracking-[0.25em] uppercase text-[var(--bone-dim)] font-mono mb-8">
          <Waves size={14} strokeWidth={1.5} />
          <span>Benguela · Costa Atlântica</span>
        </div>
        <h1 className="font-display text-[15vw] sm:text-[96px] leading-[0.9] tracking-tight text-[var(--bone)]">
          {RESTAURANTE.nome}
        </h1>
        <p className="font-display italic text-2xl sm:text-3xl text-[var(--ember-2)] mt-3">
          {RESTAURANTE.subnome}
        </p>
        <p className="mt-6 text-[var(--bone-dim)] max-w-md mx-auto text-[15px] leading-relaxed">
          {RESTAURANTE.tagline} Este é um protótipo de cardápio digital — escaneie
          a mesa de demonstração abaixo tal como um cliente faria à chegada.
        </p>
      </section>

      {/* Demo explainer strip */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="border-y border-[var(--line)] py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-[12px] uppercase tracking-[0.15em] text-[var(--bone-dim)]">
          <span>01 — Escaneia o QR da mesa</span>
          <span className="text-[var(--ember)]">02 — Escolhe e pede</span>
          <span>03 — Vê a conta em tempo real</span>
        </div>
      </section>

      {/* Table QR grid */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl text-[var(--bone)] mb-1">
          Mesas de demonstração
        </h2>
        <p className="text-[var(--bone-dim)] text-sm mb-8">
          Cada mesa real teria o próprio QR impresso. Escolhe uma para simular a
          chegada de um cliente.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {MESAS.slice(0, 8).map((mesa) => (
            <Link
              key={mesa.id}
              href={`/menu/${mesa.id}`}
              className="ticket group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
            >
              <div className="rounded-md overflow-hidden border border-[var(--ink)]/10 p-2 bg-white">
                <QRCodeSVG
                  value={`https://kianda.ao/menu/${mesa.id}`}
                  size={92}
                  fgColor="#0a1512"
                  bgColor="#ffffff"
                />
              </div>
              <div className="font-mono text-xs tracking-widest uppercase text-[var(--ink)]/60">
                Mesa
              </div>
              <div className="font-display text-3xl leading-none text-[var(--ink)]">
                {String(mesa.numero).padStart(2, "0")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Admin CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-2)] px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember-2)] mb-2">
              Do outro lado do balcão
            </p>
            <h3 className="font-display text-2xl text-[var(--bone)]">
              Painel da cozinha e do gerente
            </h3>
            <p className="text-[var(--bone-dim)] text-sm mt-2 max-w-md">
              Pedidos chegam em tempo real, o cardápio muda em segundos. Abre numa
              segunda janela para veres a sincronização ao vivo.
            </p>
          </div>
          <Link
            href="/admin"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold px-6 py-3 text-sm hover:bg-[var(--ember-2)] transition-colors"
          >
            Entrar no painel
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </main>
  );
}
