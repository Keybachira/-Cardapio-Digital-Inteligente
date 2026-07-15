// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  criarPedido,
  getPedidos,
  marcarMesaComoPaga,
  mesaEstaPaga,
  reabrirMesa,
  atualizarEstadoPedido,
} from "../store";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
    length: 0,
    key: () => null,
  });
  vi.stubGlobal("BroadcastChannel", function FakeChannel() {
    return {
      postMessage: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      close: vi.fn(),
    };
  });
  // ensure window.dispatchEvent exists (jsdom provides it, but our stubs
  // reset prototype — just wrap the real one)
  if (typeof window !== "undefined") {
    vi.spyOn(window, "dispatchEvent").mockReturnValue(true);
  }
});

describe("criarPedido", () => {
  it("cria pedido com estado 'novo'", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 2 }]);
    expect(pedido.estado).toBe("novo");
    expect(pedido.mesaId).toBe("mesa-1");
    expect(pedido.total).toBeGreaterThan(0);
    expect(pedido.pagoEm).toBeUndefined();
  });

  it("calcula total corretamente (camarão 18500 × 2)", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 2 }]);
    expect(pedido.total).toBe(37000);
  });

  it("lança ErroValidacao para item indisponível", () => {
    // p7 (costela) está disponivel: false no mock-data
    expect(() =>
      criarPedido("mesa-1", [{ pratoId: "p7", quantidade: 1 }])
    ).toThrow("não está disponível");
  });

  it("lança ErroValidacao para quantidade acima do máximo", () => {
    expect(() =>
      criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 21 }])
    ).toThrow();
  });

  it("lança ErroValidacao para mesa inválida", () => {
    expect(() =>
      criarPedido("", [{ pratoId: "p1", quantidade: 1 }])
    ).toThrow();
  });

  it("persiste o pedido no localStorage", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    const pedidos = getPedidos();
    expect(pedidos.length).toBeGreaterThanOrEqual(1);
    expect(pedidos.some((p) => p.mesaId === "mesa-1")).toBe(true);
  });

  it("não define pagoEm ao criar", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    expect(pedido.pagoEm).toBeUndefined();
  });
});

describe("atualizarEstadoPedido", () => {
  it("avança novo → preparo", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    atualizarEstadoPedido(pedido.id, "preparo");
    const atualizado = getPedidos().find((p) => p.id === pedido.id)!;
    expect(atualizado.estado).toBe("preparo");
  });

  it("não permite retroceder preparo → novo", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    atualizarEstadoPedido(pedido.id, "preparo");
    atualizarEstadoPedido(pedido.id, "novo"); // deve falhar silenciosamente
    const atualizado = getPedidos().find((p) => p.id === pedido.id)!;
    expect(atualizado.estado).toBe("preparo");
  });

  it("não permite saltar novo → pronto", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    atualizarEstadoPedido(pedido.id, "pronto");
    const atualizado = getPedidos().find((p) => p.id === pedido.id)!;
    expect(atualizado.estado).toBe("novo");
  });

  it("percorre ciclo completo novo → preparo → pronto → entregue", () => {
    const pedido = criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    atualizarEstadoPedido(pedido.id, "preparo");
    atualizarEstadoPedido(pedido.id, "pronto");
    atualizarEstadoPedido(pedido.id, "entregue");
    const atualizado = getPedidos().find((p) => p.id === pedido.id)!;
    expect(atualizado.estado).toBe("entregue");
  });
});

describe("marcarMesaComoPaga / mesaEstaPaga / reabrirMesa", () => {
  it("marcarMesaComoPaga define pagoEm em todos os pedidos da mesa", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    criarPedido("mesa-1", [{ pratoId: "p2", quantidade: 2 }]);

    marcarMesaComoPaga("mesa-1");

    const pedidos = getPedidos().filter((p) => p.mesaId === "mesa-1");
    expect(pedidos.every((p) => p.pagoEm)).toBe(true);
  });

  it("mesaEstaPaga retorna true após marcarMesaComoPaga", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    marcarMesaComoPaga("mesa-1");
    expect(mesaEstaPaga("mesa-1")).toBe(true);
  });

  it("mesaEstaPaga retorna false se não houver pedidos", () => {
    expect(mesaEstaPaga("mesa-vazia")).toBe(false);
  });

  it("mesaEstaPaga retorna false se houver pedidos não pagos", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    expect(mesaEstaPaga("mesa-1")).toBe(false);
  });

  it("reabrirMesa limpa pagoEm de todos os pedidos", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    marcarMesaComoPaga("mesa-1");
    expect(mesaEstaPaga("mesa-1")).toBe(true);

    reabrirMesa("mesa-1");
    expect(mesaEstaPaga("mesa-1")).toBe(false);
  });

  it("marcarMesaComoPaga só afeta a mesa alvo", () => {
    criarPedido("mesa-1", [{ pratoId: "p1", quantidade: 1 }]);
    criarPedido("mesa-2", [{ pratoId: "p2", quantidade: 1 }]);

    marcarMesaComoPaga("mesa-1");

    expect(mesaEstaPaga("mesa-1")).toBe(true);
    expect(mesaEstaPaga("mesa-2")).toBe(false);
  });
});
