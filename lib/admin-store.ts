"use client";

import { estaAutenticado } from "./auth";
import {
  atualizarEstadoPedido as storeAtualizarEstado,
  limparPedidosMesa as storeLimparMesa,
  reabrirMesa as storeReabrirMesa,
  useCardapio as storeUseCardapio,
  usePedidos as storeUsePedidos,
} from "./store";
import type { EstadoPedido } from "./types";

function guard() {
  if (!estaAutenticado()) {
    throw new Error("Acesso negado — apenas administradores.");
  }
}

// ---------- Pedidos (admin — sem filtro de mesa) ----------

export function usePedidosAdmin() {
  return storeUsePedidos();
}

// ---------- Estado pedido ----------

export function atualizarEstadoPedido(id: string, estado: EstadoPedido) {
  guard();
  storeAtualizarEstado(id, estado);
}

// ---------- Pagamento (admin) ----------

export function reabrirMesa(mesaId: string) {
  guard();
  storeReabrirMesa(mesaId);
}

export function limparPedidosMesa(mesaId: string) {
  guard();
  storeLimparMesa(mesaId);
}

// ---------- Cardápio (admin — full CRUD) ----------

export function useCardapioAdmin() {
  return storeUseCardapio();
}

// ---------- Partilhado ----------

export { formatoKz } from "./store";
