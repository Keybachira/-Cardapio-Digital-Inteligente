"use client";

import { useCallback, useEffect, useState } from "react";
import { imagemTestePrato, PRATOS } from "./mock-data";
import { EstadoPedido, ItemCarrinho, Pedido, Prato } from "./types";
import {
  validarItensCarrinho,
  validarMesaId,
  validarNotas,
  validarTransicaoEstado,
} from "./validations";

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

function normalizarImagemPrato(prato: Prato): Prato {
  if (!prato.imagem || prato.imagem.startsWith("/mock-imgs/")) {
    return { ...prato, imagem: imagemTestePrato(prato.id) };
  }
  return prato;
}

export function getPratos(): Prato[] {
  const guardados = read<Prato[]>(KEY_PRATOS, PRATOS);
  const normalizados = guardados.map(normalizarImagemPrato);
  const mudou = guardados.some((prato, index) => prato.imagem !== normalizados[index].imagem);
  if (mudou) write(KEY_PRATOS, normalizados);
  return normalizados;
}

export function useCardapio() {
  const [pratos, setPratos] = useState<Prato[]>(() => getPratos());

  const reload = useCallback(() => setPratos(getPratos()), []);

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
  validarMesaId(mesaId);
  const cardapio = getPratos();
  validarItensCarrinho(itensCarrinho, cardapio);

  const itens = itensCarrinho.map((ic) => {
    const prato = cardapio.find((p) => p.id === ic.pratoId)!;
    return {
      pratoId: prato.id,
      nome: prato.nome,
      preco: prato.preco,
      quantidade: ic.quantidade,
      notas: validarNotas(ic.notas),
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
  const pedido = atuais.find((p) => p.id === id);
  if (!pedido) {
    console.warn(`Pedido "${id}" não encontrado.`);
    return;
  }
  try {
    validarTransicaoEstado(pedido.estado, estado);
  } catch (e) {
    console.warn(e instanceof Error ? e.message : "Transição inválida.");
    return;
  }
  const novos = atuais.map((p) =>
    p.id === id ? { ...p, estado, atualizadoEm: Date.now() } : p
  );
  write(KEY_PEDIDOS, novos);
  broadcast("kianda:pedidos:changed");
}

export function marcarMesaComoPaga(mesaId: string) {
  const atuais = getPedidos();
  const novos = atuais.map((p) =>
    p.mesaId === mesaId && !p.pagoEm
      ? { ...p, pagoEm: Date.now(), atualizadoEm: Date.now() }
      : p
  );
  write(KEY_PEDIDOS, novos);
  broadcast("kianda:pedidos:changed");
}

export function reabrirMesa(mesaId: string) {
  const atuais = getPedidos();
  const novos = atuais.map((p) =>
    p.mesaId === mesaId && p.pagoEm
      ? { ...p, pagoEm: undefined, atualizadoEm: Date.now() }
      : p
  );
  write(KEY_PEDIDOS, novos);
  broadcast("kianda:pedidos:changed");
}

export function mesaEstaPaga(mesaId: string): boolean {
  const atuais = getPedidos().filter((p) => p.mesaId === mesaId);
  if (atuais.length === 0) return false;
  return atuais.every((p) => p.pagoEm);
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
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const todos = getPedidos().sort((a, b) => b.criadoEm - a.criadoEm);
    return mesaId ? todos.filter((p) => p.mesaId === mesaId) : todos;
  });

  const reload = useCallback(() => {
    const todos = getPedidos().sort((a, b) => b.criadoEm - a.criadoEm);
    setPedidos(mesaId ? todos.filter((p) => p.mesaId === mesaId) : todos);
  }, [mesaId]);

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
  const [itens, setItens] = useState<ItemCarrinho[]>(() => getCarrinho(mesaId));

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
        if (atuais[idx].quantidade >= 20) return;
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

  const atualizarNotas = useCallback(
    (pratoId: string, notas: string) => {
      const atuais = getCarrinho(mesaId);
      const novos = atuais.map((i) =>
        i.pratoId === pratoId ? { ...i, notas } : i
      );
      persist(novos);
    },
    [mesaId, persist]
  );

  const limpar = useCallback(() => persist([]), [persist]);

  return { itens, adicionar, remover, atualizarNotas, limpar };
}

// ---------- Garçom (chamadas) ----------

const KEY_CHAMADAS = "kianda:chamadas";

export type ChamadaGarcom = {
  mesaId: string;
  mesaNumero: number;
  motivo: "atencao" | "conta" | "ajuda";
  criadoEm: number;
};

export function getChamadas(): ChamadaGarcom[] {
  return read<ChamadaGarcom[]>(KEY_CHAMADAS, []);
}

export function chamarGarcom(
  mesaId: string,
  mesaNumero: number,
  motivo: ChamadaGarcom["motivo"]
) {
  const atuais = getChamadas();
  // avoid duplicates within last 2 minutes
  const recente = atuais.some(
    (c) => c.mesaId === mesaId && Date.now() - c.criadoEm < 120_000
  );
  if (recente) return;
  const nova: ChamadaGarcom = { mesaId, mesaNumero, motivo, criadoEm: Date.now() };
  write(KEY_CHAMADAS, [...atuais, nova]);
  broadcast("kianda:chamadas:changed");
}

export function removerChamada(mesaId: string) {
  const atuais = getChamadas();
  write(KEY_CHAMADAS, atuais.filter((c) => c.mesaId !== mesaId));
  broadcast("kianda:chamadas:changed");
}

export function useChamadas() {
  const [chamadas, setChamadas] = useState<ChamadaGarcom[]>(() => getChamadas());

  const reload = useCallback(() => setChamadas(getChamadas()), []);

  useSyncedTopic("kianda:chamadas:changed", reload);

  return chamadas.sort((a, b) => b.criadoEm - a.criadoEm);
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
