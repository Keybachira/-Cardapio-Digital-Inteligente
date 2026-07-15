"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const KEY_SESSAO = "kianda:admin_sessao";
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000; // 8 horas

interface AdminSessao {
  email: string;
  inicio: number;
}

const ADMIN_CREDENCIAL = {
  email: "gerencia@kianda.ao",
  senha: "kianda2024",
};

function lerSessao(): AdminSessao | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_SESSAO);
    if (!raw) return null;
    const sessao = JSON.parse(raw) as AdminSessao;
    if (Date.now() - sessao.inicio > DURACAO_SESSAO_MS) {
      localStorage.removeItem(KEY_SESSAO);
      return null;
    }
    return sessao;
  } catch {
    localStorage.removeItem(KEY_SESSAO);
    return null;
  }
}

export function login(email: string, senha: string): { sucesso: boolean; erro?: string } {
  if (email !== ADMIN_CREDENCIAL.email || senha !== ADMIN_CREDENCIAL.senha) {
    return { sucesso: false, erro: "E-mail ou palavra-passe incorretos." };
  }
  const sessao: AdminSessao = { email, inicio: Date.now() };
  localStorage.setItem(KEY_SESSAO, JSON.stringify(sessao));
  return { sucesso: true };
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_SESSAO);
}

export function estaAutenticado(): boolean {
  return lerSessao() !== null;
}

export function useAdminAuth() {
  const [autenticado, setAutenticado] = useState(() => estaAutenticado());
  const router = useRouter();

  const verificar = useCallback(() => {
    setAutenticado(estaAutenticado());
  }, []);

  const sair = useCallback(() => {
    logout();
    setAutenticado(false);
    router.push("/admin");
  }, [router]);

  return { autenticado, verificar, sair };
}
