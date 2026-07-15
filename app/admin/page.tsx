"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESTAURANTE } from "@/lib/mock-data";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("gerencia@kianda.ao");
  const [senha, setSenha] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    router.push("/admin/pedidos");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, var(--ocean-2) 0%, var(--ocean) 32%, var(--ink) 68%)",
      }}
    >
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--ink-2)] px-8 py-9"
      >
        <div className="flex items-center gap-2 mb-1 text-[var(--bone-dim)]">
          <Lock size={14} />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
            Acesso restrito
          </span>
        </div>
        <h1 className="font-display text-2xl text-[var(--bone)] mt-1 mb-6">
          Painel {RESTAURANTE.nome}
        </h1>

        <label className="block text-xs text-[var(--bone-dim)] mb-1.5">
          E-mail
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3.5 py-2.5 text-sm text-[var(--bone)] mb-4 outline-none focus:border-[var(--ember)]"
        />
        <label className="block text-xs text-[var(--bone-dim)] mb-1.5">
          Palavra-passe
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg bg-[var(--ink)] border border-[var(--line-strong)] px-3.5 py-2.5 text-sm text-[var(--bone)] mb-6 outline-none focus:border-[var(--ember)]"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-[var(--ember)] text-[var(--ink)] font-semibold py-3 text-sm hover:bg-[var(--ember-2)] transition-colors"
        >
          Entrar
        </button>
        <p className="text-center text-[var(--bone-dim)] text-[11px] mt-4 font-mono">
          Protótipo — qualquer credencial entra
        </p>
      </form>
    </main>
  );
}
