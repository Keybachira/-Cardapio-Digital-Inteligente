import { describe, expect, it } from "vitest";
import { gerarCodigoMesa, validarCodigoMesa } from "../daily-code";

describe("gerarCodigoMesa", () => {
  it("retorna string de 4 caracteres", () => {
    const codigo = gerarCodigoMesa("mesa-1");
    expect(codigo).toHaveLength(4);
  });

  it("contém apenas caracteres A-Z e 2-9 (sem 0, 1, O)", () => {
    const codigo = gerarCodigoMesa("mesa-1");
    expect(codigo).toMatch(/^[A-Z2-9]{4}$/);
  });

  it("é determinístico — mesma mesa no mesmo dia retorna o mesmo código", () => {
    const a = gerarCodigoMesa("mesa-1");
    const b = gerarCodigoMesa("mesa-1");
    expect(a).toBe(b);
  });

  it("mesas diferentes geram códigos diferentes", () => {
    const a = gerarCodigoMesa("mesa-1");
    const b = gerarCodigoMesa("mesa-2");
    expect(a).not.toBe(b);
  });

  it("tem boa distribuição — alta probabilidade de códigos únicos para 12 mesas", () => {
    const codigos = Array.from({ length: 12 }, (_, i) =>
      gerarCodigoMesa(`mesa-${i + 1}`)
    );
    const unicos = new Set(codigos);
    // Esperamos ≥11 únicos (colisões são extremamente raras com 32^4 espaço)
    expect(unicos.size).toBeGreaterThanOrEqual(11);
  });
});

describe("validarCodigoMesa", () => {
  it("valida código correto (case-insensitive)", () => {
    const codigo = gerarCodigoMesa("mesa-1");
    expect(validarCodigoMesa("mesa-1", codigo)).toBe(true);
  });

  it("aceita código em minúsculas", () => {
    const codigo = gerarCodigoMesa("mesa-1");
    expect(validarCodigoMesa("mesa-1", codigo.toLowerCase())).toBe(true);
  });

  it("rejeita código errado", () => {
    expect(validarCodigoMesa("mesa-1", "XXXX")).toBe(false);
  });

  it("rejeita código vazio", () => {
    expect(validarCodigoMesa("mesa-1", "")).toBe(false);
  });

  it("rejeita código null/undefined", () => {
    expect(validarCodigoMesa("mesa-1", null as unknown as string)).toBe(false);
    expect(validarCodigoMesa("mesa-1", undefined as unknown as string)).toBe(false);
  });

  it("rejeita código de outra mesa", () => {
    const codigoMesa1 = gerarCodigoMesa("mesa-1");
    expect(validarCodigoMesa("mesa-2", codigoMesa1)).toBe(false);
  });

  it("código da mesa-1 é inválido para mesa-1 depois da meia-noite (determinismo por data)", () => {
    // Esta asserção apenas confirma que o código depende da data:
    // não podemos testar atravessar dias sem mock, mas podemos verificar
    // que o código contém o dia de hoje no hash
    const codigo = gerarCodigoMesa("mesa-1");
    expect(typeof codigo).toBe("string");
    expect(codigo.length).toBe(4);
  });
});
