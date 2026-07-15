import { describe, expect, it } from "vitest";
import {
  validarMesaId,
  validarQuantidade,
  validarNotas,
  validarTransicaoEstado,
} from "../validations";
import { ErroValidacao } from "../types";

describe("validarMesaId", () => {
  it("aceita mesa-id padrão", () => {
    expect(() => validarMesaId("mesa-3")).not.toThrow();
  });

  it("aceita mesa-1 e mesa-12", () => {
    expect(() => validarMesaId("mesa-1")).not.toThrow();
    expect(() => validarMesaId("mesa-12")).not.toThrow();
  });

  it("rejeita string vazia", () => {
    expect(() => validarMesaId("")).toThrow(ErroValidacao);
  });

  it("rejeita null/undefined", () => {
    expect(() => validarMesaId(null as unknown as string)).toThrow(ErroValidacao);
    expect(() => validarMesaId(undefined as unknown as string)).toThrow(ErroValidacao);
  });

  it("rejeita formato inválido", () => {
    expect(() => validarMesaId("mesa")).toThrow(ErroValidacao);
    expect(() => validarMesaId("table-1")).toThrow(ErroValidacao);
    expect(() => validarMesaId("1")).toThrow(ErroValidacao);
  });
});

describe("validarQuantidade", () => {
  it("aceita 1", () => {
    expect(() => validarQuantidade(1)).not.toThrow();
  });

  it("aceita 20 (MAX_QUANTIDADE)", () => {
    expect(() => validarQuantidade(20)).not.toThrow();
  });

  it("aceita valores no meio do intervalo", () => {
    expect(() => validarQuantidade(5)).not.toThrow();
    expect(() => validarQuantidade(10)).not.toThrow();
    expect(() => validarQuantidade(15)).not.toThrow();
  });

  it("rejeita 0", () => {
    expect(() => validarQuantidade(0)).toThrow(ErroValidacao);
  });

  it("rejeita números negativos", () => {
    expect(() => validarQuantidade(-1)).toThrow(ErroValidacao);
  });

  it("rejeita 21 (acima do máximo)", () => {
    expect(() => validarQuantidade(21)).toThrow(ErroValidacao);
  });

  it("rejeita valores muito grandes", () => {
    expect(() => validarQuantidade(100)).toThrow(ErroValidacao);
  });

  it("rejeita NaN", () => {
    expect(() => validarQuantidade(NaN)).toThrow(ErroValidacao);
  });

  it("rejeita não-números", () => {
    expect(() => validarQuantidade("5" as unknown as number)).toThrow(ErroValidacao);
  });
});

describe("validarNotas", () => {
  it("retorna string vazia para undefined", () => {
    expect(validarNotas(undefined)).toBe("");
  });

  it("retorna string vazia para string vazia", () => {
    expect(validarNotas("")).toBe("");
  });

  it("aceita notas curtas", () => {
    expect(validarNotas("sem cebola")).toBe("sem cebola");
  });

  it("aceita notas de 200 chars exatos", () => {
    const notas = "a".repeat(200);
    expect(validarNotas(notas)).toBe(notas);
  });

  it("rejeita notas com mais de MAX_NOTAS_LENGTH", () => {
    const notas = "a".repeat(201);
    expect(() => validarNotas(notas)).toThrow(ErroValidacao);
  });

  it("rejeita notas muito longas", () => {
    const notas = "a".repeat(500);
    expect(() => validarNotas(notas)).toThrow(ErroValidacao);
  });
});

describe("validarTransicaoEstado", () => {
  it("permite novo → preparo", () => {
    expect(() => validarTransicaoEstado("novo", "preparo")).not.toThrow();
  });

  it("permite preparo → pronto", () => {
    expect(() => validarTransicaoEstado("preparo", "pronto")).not.toThrow();
  });

  it("permite pronto → entregue", () => {
    expect(() => validarTransicaoEstado("pronto", "entregue")).not.toThrow();
  });

  it("rejeita entregue → qualquer coisa", () => {
    expect(() => validarTransicaoEstado("entregue", "novo")).toThrow(ErroValidacao);
    expect(() => validarTransicaoEstado("entregue", "preparo")).toThrow(ErroValidacao);
    expect(() => validarTransicaoEstado("entregue", "pronto")).toThrow(ErroValidacao);
  });

  it("rejeita saltos (novo → pronto)", () => {
    expect(() => validarTransicaoEstado("novo", "pronto")).toThrow(ErroValidacao);
  });

  it("rejeita retrocesso (preparo → novo)", () => {
    expect(() => validarTransicaoEstado("preparo", "novo")).toThrow(ErroValidacao);
  });

  it("rejeita estados inválidos", () => {
    expect(() =>
      validarTransicaoEstado("unknown" as never, "novo")
    ).toThrow(ErroValidacao);
    expect(() =>
      validarTransicaoEstado("novo", "unknown" as never)
    ).toThrow(ErroValidacao);
  });

  it("rejeita transição para o mesmo estado", () => {
    expect(() => validarTransicaoEstado("novo", "novo")).toThrow(ErroValidacao);
  });
});
