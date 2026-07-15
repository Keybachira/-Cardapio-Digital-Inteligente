"use client";

import { useCallback, useEffect, useState } from "react";
import { PRATOS } from "./mock-data";
import { EstadoPedido, ItemCarrinho, Pedido, Prato } from "./types";

const KEY_PEDIDOS = "kianda:pedidos";
const KEY_PRATOS = "kianda:pratos";
const CHANNEL = "kianda-sync";

let bc: BroadcastChannel | null = null;
function channel() {
  if (typeof window === "undefined") return null;
  if (!bc) bc = new BroadcastChannel(CHANNEL);
  return bc;
}

function broadcast(topic: string) {
  channel()?.postMessage(topic);
  // also fire a same-tab custom event, since 'storage' events don't fire
  // in the tab that made the change
  window.dispatchEvent(new CustomEvent(topic));
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function useSyncedTopic(topic: string, onChange: () => void) {
  useEffect(() => {
    const handler = () => onChange();
    window.addEventListener(topic, handler);
    const ch = channel();
    const bcHandler = (e: MessageEvent) => {
      if (e.data === topic) onChange();
    };
    ch?.addEventListener("message", bcHandler);
    return () => {
      window.removeEventListener(topic, handler);
      ch?.removeEventListener("message", bcHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);
}

// ---------- Pratos (cardápio) ----------

export function getPratos(): Prato[] {
  return read<Prato[]>(KEY_PRATOS, PRATOS);
}

export function useCardapio() {
  const [pratos, setPratos] = useState<Prato[]>(PRATOS);

  const reload = useCallback(() => setPratos(getPratos()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  useSyncedTopic("kianda:pratos:changed", reload);

  const salvarPrato = useCallback((prato: Prato) => {
    const atuais = getPratos();
    const idx = atuais.findIndex((p) => p.id === prato.id);
    const novos =
      idx >= 0
        ? atuais.map((p) => (p.id === prato.id ? prato : p))
        : [...atuais, prato];
    write(KEY_PRATOS, novos);
    broadcast("kianda:pratos:changed");
  }, []);

  const alternarDisponibilidade = useCallback((id: string) => {
    const atuais = getPratos();
    const novos = atuais.map((p) =>
      p.id === id ? { ...p, disponivel: !p.disponivel } : p
    );
    write(KEY_PRATOS, novos);
    broadcast("kianda:pratos:changed");
  }, []);

  const removerPrato = useCallback((id: string) => {
    const atuais = getPratos();
    write(
      KEY_PRATOS,
      atuais.filter((p) => p.id !== id)
    );
    broadcast("kianda:pratos:changed");
  }, []);

  return { pratos, salvarPrato, alternarDisponibilidade, removerPrato };
}

// ---------- Pedidos ----------

export function getPedidos(): Pedido[] {
  return read<Pedido[]>(KEY_PEDIDOS, []);
}

function gerarIdPedido() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function criarPedido(mesaId: string, itensCarrinho: ItemCarrinho[]): Pedido {
  const cardapio = getPratos();
  const itens = itensCarrinho.map((ic) => {
    const prato = cardapio.find((p) => p.id === ic.pratoId)!;
    return {
      pratoId: prato.id,
      nome: prato.nome,
      preco: prato.preco,
      quantidade: ic.quantidade,
      notas: ic.notas,
    };
  });
  const total = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const pedido: Pedido = {
    id: gerarIdPedido(),
    mesaId,
    itens,
    estado: "novo",
    criadoEm: Date.now(),
    atualizadoEm: Date.now(),
    total,
  };
  const atuais = getPedidos();
  write(KEY_PEDIDOS, [...atuais, pedido]);
  broadcast("kianda:pedidos:changed");
  return pedido;
}

export function atualizarEstadoPedido(id: string, estado: EstadoPedido) {
  const atuais = getPedidos();
  const novos = atuais.map((p) =>
    p.id === id ? { ...p, estado, atualizadoEm: Date.now() } : p
  );
  write(KEY_PEDIDOS, novos);
  broadcast("kianda:pedidos:changed");
}

export function limparPedidosMesa(mesaId: string) {
  const atuais = getPedidos();
  write(
    KEY_PEDIDOS,
    atuais.filter((p) => p.mesaId !== mesaId)
  );
  broadcast("kianda:pedidos:changed");
}

export function usePedidos(mesaId?: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const reload = useCallback(() => {
    const todos = getPedidos().sort((a, b) => b.criadoEm - a.criadoEm);
    setPedidos(mesaId ? todos.filter((p) => p.mesaId === mesaId) : todos);
  }, [mesaId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useSyncedTopic("kianda:pedidos:changed", reload);

  return pedidos;
}

// ---------- Carrinho (por mesa, em memória de sessão) ----------

function keyCarrinho(mesaId: string) {
  return `kianda:carrinho:${mesaId}`;
}

export function getCarrinho(mesaId: string): ItemCarrinho[] {
  return read<ItemCarrinho[]>(keyCarrinho(mesaId), []);
}

export function useCarrinho(mesaId: string) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const reload = useCallback(() => setItens(getCarrinho(mesaId)), [mesaId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const persist = useCallback(
    (novos: ItemCarrinho[]) => {
      write(keyCarrinho(mesaId), novos);
      setItens(novos);
    },
    [mesaId]
  );

  const adicionar = useCallback(
    (pratoId: string) => {
      const atuais = getCarrinho(mesaId);
      const idx = atuais.findIndex((i) => i.pratoId === pratoId);
      if (idx >= 0) {
        const novos = [...atuais];
        novos[idx] = { ...novos[idx], quantidade: novos[idx].quantidade + 1 };
        persist(novos);
      } else {
        persist([...atuais, { pratoId, quantidade: 1 }]);
      }
    },
    [mesaId, persist]
  );

  const remover = useCallback(
    (pratoId: string) => {
      const atuais = getCarrinho(mesaId);
      const idx = atuais.findIndex((i) => i.pratoId === pratoId);
      if (idx < 0) return;
      const item = atuais[idx];
      if (item.quantidade <= 1) {
        persist(atuais.filter((i) => i.pratoId !== pratoId));
      } else {
        const novos = [...atuais];
        novos[idx] = { ...item, quantidade: item.quantidade - 1 };
        persist(novos);
      }
    },
    [mesaId, persist]
  );

  const limpar = useCallback(() => persist([]), [persist]);

  return { itens, adicionar, remover, limpar };
}

export function formatoKz(valor: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(valor)
    .replace("AOA", "Kz");
}
