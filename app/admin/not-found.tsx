import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--ink)" }}>
      <div className="text-center">
        <p className="font-display text-5xl text-[var(--bone-dim)] mb-2">404</p>
        <p className="text-[var(--bone-dim)] text-sm mb-6">
          Página não encontrada no painel.
        </p>
        <Link
          href="/admin"
          className="inline-block rounded-full bg-[var(--ember)] text-[var(--ink)] px-6 py-2 text-sm font-semibold"
        >
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
