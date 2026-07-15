import { MESAS } from "./mock-data";
import {
  ErroValidacao,
  EstadoPedido,
  ItemCarrinho,
  MAX_NOTAS_LENGTH,
  MAX_QUANTIDADE,
  Prato,
  TRANSICOES_VALIDAS,
} from "./types";

export function validarMesaId(mesaId: string): void {
  if (!mesaId || typeof mesaId !== "string") {
    throw new ErroValidacao("ID da mesa inválido.");
  }
  const existe = MESAS.some((m) => m.id === mesaId);
  if (!existe) {
    throw new ErroValidacao(`Mesa "${mesaId}" não encontrada.`);
  }
}

export function validarQuantidade(quantidade: unknown): void {
  if (typeof quantidade !== "number" || !Number.isInteger(quantidade)) {
    throw new ErroValidacao("Quantidade deve ser um número inteiro.");
  }
  if (quantidade < 1) {
    throw new ErroValidacao("Quantidade mínima é 1.");
  }
  if (quantidade > MAX_QUANTIDADE) {
    throw new ErroValidacao(`Quantidade máxima por item é ${MAX_QUANTIDADE}.`);
  }
}

export function validarNotas(notas: unknown): string {
  if (notas === undefined || notas === null) return "";
  if (typeof notas !== "string") {
    throw new ErroValidacao("Notas devem ser texto.");
  }
  const trimmed = notas.trim();
  if (trimmed.length > MAX_NOTAS_LENGTH) {
    throw new ErroValidacao(
      `Notas excedem o limite de ${MAX_NOTAS_LENGTH} caracteres.`
    );
  }
  return trimmed;
}

export function validarItensCarrinho(
  itens: ItemCarrinho[],
  cardapio: Prato[]
): void {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new ErroValidacao("Carrinho vazio. Adiciona pelo menos um item.");
  }

  const vistos = new Set<string>();

  for (const item of itens) {
    if (!item || typeof item !== "object") {
      throw new ErroValidacao("Item do carrinho inválido.");
    }
    if (!item.pratoId || typeof item.pratoId !== "string") {
      throw new ErroValidacao("Item sem identificador do prato.");
    }

    validarQuantidade(item.quantidade);

    const prato = cardapio.find((p) => p.id === item.pratoId);
    if (!prato) {
      throw new ErroValidacao(`Prato "${item.pratoId}" não encontrado no cardápio.`);
    }
    if (!prato.disponivel) {
      throw new ErroValidacao(`"${prato.nome}" não está disponível neste momento.`);
    }

    if (vistos.has(item.pratoId)) {
      throw new ErroValidacao(`Item duplicado no carrinho: "${prato.nome}".`);
    }
    vistos.add(item.pratoId);

    validarNotas(item.notas);
  }
}

export function validarTransicaoEstado(
  atual: EstadoPedido,
  proximo: EstadoPedido
): void {
  const permitidos = TRANSICOES_VALIDAS[atual];
  if (!permitidos || !permitidos.includes(proximo)) {
    throw new ErroValidacao(
      `Transição inválida: "${atual}" → "${proximo}". ` +
        `Permitidas: ${permitidos?.join(", ") || "nenhuma"}.`
    );
  }
}
