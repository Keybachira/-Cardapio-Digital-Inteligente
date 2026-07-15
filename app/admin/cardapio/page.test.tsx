import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

const salvarPrato = vi.fn();
const alternarDisponibilidade = vi.fn();
const removerPrato = vi.fn();

vi.mock("@/lib/admin-store", () => ({
  formatoKz: (value: number) => `Kz ${value}`,
  useCardapioAdmin: () => ({
    pratos: [],
    salvarPrato,
    alternarDisponibilidade,
    removerPrato,
  }),
}));

vi.mock("@/lib/mock-data", () => ({
  CATEGORIAS: [
    { id: "entradas", nome: "Entradas" },
    { id: "brasa", nome: "Na Brasa" },
  ],
}));

import CardapioPage from "./page";

describe("CardapioPage", () => {
  beforeEach(() => {
    salvarPrato.mockReset();
    alternarDisponibilidade.mockReset();
    removerPrato.mockReset();
  });

  it("persists an image URL when creating a new dish", async () => {
    const user = userEvent.setup();

    render(<CardapioPage />);

    await user.click(screen.getByRole("button", { name: /novo prato/i }));
    await user.type(screen.getByPlaceholderText("Nome do prato"), "Picanha");
    await user.type(screen.getByPlaceholderText("Preço (Kz)"), "2500");
    await user.type(
      screen.getByPlaceholderText("Descrição (opcional)"),
      "Carne grelhada"
    );
    await user.type(
      screen.getByPlaceholderText("URL da imagem (opcional)"),
      "https://example.com/picanha.jpg"
    );
    await user.click(screen.getByRole("button", { name: /adicionar ao cardápio/i }));

    expect(salvarPrato).toHaveBeenCalledTimes(1);
    expect(salvarPrato).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Picanha",
        preco: 2500,
        descricao: "Carne grelhada",
        categoria: "entradas",
        disponivel: true,
        imagem: "https://example.com/picanha.jpg",
      })
    );
  });
});
