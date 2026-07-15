import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  BellRing,
  ChefHat,
  Clock3,
  LayoutDashboard,
  ReceiptText,
  ScanQrCode,
  Sparkles,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { gerarCodigoMesa } from "@/lib/daily-code";
import { MESAS, PRATOS, RESTAURANTE } from "@/lib/mock-data";

const mesaDemo = MESAS[0];
const codigoDemo = gerarCodigoMesa(mesaDemo.id);
const urlDemo = `/menu/${mesaDemo.id}?codigo=${codigoDemo}`;
function formatKz(valor: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(valor)
    .replace("AOA", "Kz");
}

const highlights = [
  {
    icon: ScanQrCode,
    title: "QR por mesa",
    text: "Cada mesa abre o menu certo com código diário.",
  },
  {
    icon: UtensilsCrossed,
    title: "Pedido sem fila",
    text: "O cliente escolhe, adiciona notas e envia para a cozinha.",
  },
  {
    icon: ReceiptText,
    title: "Conta em tempo real",
    text: "A mesa acompanha pedidos, estado e total sem chamar a equipa.",
  },
];

const stats = [
  { value: String(MESAS.length).padStart(2, "0"), label: "mesas demo" },
  { value: String(PRATOS.length), label: "itens no menu" },
  { value: "live", label: "sincronização" },
];

export default function Home() {
  const destaques = PRATOS.filter((prato) => prato.destaque).slice(0, 3);

  return (
    <main className="min-h-[100dvh] overflow-hidden noise bg-[var(--ink)] text-[var(--bone)]">
      <section className="relative isolate px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_82%_8%,rgba(255,90,31,0.22),transparent_46%),radial-gradient(80%_70%_at_12%_0%,rgba(26,71,64,0.9),transparent_52%),linear-gradient(135deg,var(--ink)_0%,var(--ocean)_58%,var(--ink)_100%)]" />

        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[20px] border border-[var(--line)] bg-[var(--ink)]/55 px-4 backdrop-blur-xl sm:px-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Kianda">
            <LogoMark size={34} />
            <div>
              <p className="font-display text-lg font-semibold leading-none text-[var(--bone)]">
                {RESTAURANTE.nome}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bone-dim)]">
                {RESTAURANTE.subnome}
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[var(--bone-dim)] md:flex">
            <a href="#experiencia" className="transition-colors hover:text-[var(--bone)]">
              Experiência
            </a>
            <a href="#mesas" className="transition-colors hover:text-[var(--bone)]">
              Mesas
            </a>
            <Link href="/garcom" className="transition-colors hover:text-[var(--bone)]">
              Garçom
            </Link>
          </nav>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ember)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ember-2)] active:translate-y-px"
          >
            Painel
            <LayoutDashboard size={16} />
          </Link>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 pb-14 pt-12 sm:pb-20 sm:pt-16 lg:min-h-[calc(100dvh-104px)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--ink-2)]/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--bone-dim)] backdrop-blur">
              <Waves size={13} className="text-[var(--ember-2)]" />
              {RESTAURANTE.cidade} · Costa Atlântica
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--bone)] sm:text-7xl lg:text-[92px]">
              Cardápio digital com alma de restaurante à beira-mar.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--bone-dim)] sm:text-lg">
              Kianda junta QR à mesa, pedidos ao vivo, conta transparente e painel de cozinha num protótipo pronto para demonstração.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={urlDemo}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ember)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ember-2)] active:translate-y-px"
              >
                Testar mesa 01
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--ink)]/35 px-6 py-3.5 text-sm font-semibold text-[var(--bone)] transition hover:border-[var(--ember)] hover:text-[var(--ember-2)] active:translate-y-px"
              >
                Abrir painel da cozinha
                <ChefHat size={17} />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-[var(--line)] rounded-[20px] border border-[var(--line)] bg-[var(--ink)]/35 p-1 backdrop-blur">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--bone-dim)]">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-semibold text-[var(--bone)]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-scale-in lg:justify-self-end" style={{ animationDelay: "0.16s" }}>
            <div className="absolute -left-6 top-10 hidden w-40 rounded-[20px] border border-[var(--line)] bg-[var(--ink-2)]/82 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:block">
              <div className="flex items-center gap-2 text-[var(--ember-2)]">
                <BellRing size={16} />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Garçom</span>
              </div>
              <p className="mt-3 text-sm leading-5 text-[var(--bone)]">
                Chamada da mesa 01 recebida no painel.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[430px] rounded-[32px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(245,232,207,0.12),rgba(245,232,207,0.04))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--ink)]">
                <div className="relative h-56 bg-[linear-gradient(135deg,rgba(255,90,31,0.28),rgba(15,47,42,0.86)),url('/Mock-imge/images1.jpg')] bg-cover bg-center">
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--ink)] to-transparent p-5 pt-20">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                          Mesa 01
                        </p>
                        <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--bone)]">
                          {RESTAURANTE.nome}
                        </h2>
                      </div>
                      <div className="rounded-2xl bg-white p-2 shadow-xl">
                        <QRCodeSVG value={`https://kianda.ao${urlDemo}`} size={76} fgColor="#071812" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between rounded-[18px] border border-[var(--line)] bg-[var(--ink-2)] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ember)]/14 text-[var(--ember-2)]">
                        <Clock3 size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--bone)]">Pedido em preparo</p>
                        <p className="text-xs text-[var(--bone-dim)]">Sincronizado com a cozinha</p>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-[var(--ember)] shadow-[0_0_18px_var(--ember)]" />
                  </div>

                  {destaques.map((prato) => (
                    <div key={prato.id} className="flex items-center gap-3 rounded-[18px] bg-white p-2.5 text-[var(--text-primary)]">
                      <img
                        src={prato.imagem}
                        alt=""
                        className="h-14 w-14 rounded-[14px] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{prato.nome}</p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">{prato.descricao}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[var(--ember)]">
                        {formatKz(prato.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiencia" className="border-y border-[var(--line)] bg-[var(--ink-2)]/45 px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[22px] border border-[var(--line)] bg-[var(--ink)]/42 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ember)]/13 text-[var(--ember-2)]">
                  <Icon size={20} />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-[var(--bone)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--bone-dim)]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="mesas" className="px-5 py-14 sm:px-8 sm:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--bone-dim)]">
              <Sparkles size={13} className="text-[var(--ember-2)]" />
              Demo interativa
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--bone)] sm:text-5xl">
              Escolhe uma mesa e simula a jornada do cliente.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--bone-dim)]">
              Cada bilhete gera um QR com código de acesso do dia. O mesmo fluxo conversa com o painel administrativo em outra aba.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {MESAS.map((mesa, index) => {
              const codigo = gerarCodigoMesa(mesa.id);
              const href = `/menu/${mesa.id}?codigo=${codigo}`;
              return (
                <Link
                  key={mesa.id}
                  href={href}
                  className="ticket group flex min-h-52 flex-col items-center justify-between gap-3 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/20 active:translate-y-px"
                  style={{ animationDelay: `${0.03 * index}s` }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]/48">
                    Mesa
                  </span>
                  <span className="font-display text-5xl font-semibold leading-none text-[var(--ink)]">
                    {String(mesa.numero).padStart(2, "0")}
                  </span>
                  <div className="rounded-[14px] bg-white p-2 shadow-sm">
                    <QRCodeSVG value={`https://kianda.ao${href}`} size={78} fgColor="#071812" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--ink)]/45">
                    {codigo}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
