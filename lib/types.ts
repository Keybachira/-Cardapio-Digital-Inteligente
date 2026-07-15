export type Categoria =
  | "entradas"
  | "brasa"
  | "mar"
  | "acompanhamentos"
  | "sobremesas"
  | "bebidas";

export interface Prato {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // Kz
  categoria: Categoria;
  disponivel: boolean;
  destaque?: boolean; // escolha do chef
  picante?: boolean;
}

export interface Mesa {
  id: string;
  numero: number;
}

export type EstadoPedido = "novo" | "preparo" | "pronto" | "entregue";

export interface ItemPedido {
  pratoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  notas?: string;
}

export interface Pedido {
  id: string;
  mesaId: string;
  itens: ItemPedido[];
  estado: EstadoPedido;
  criadoEm: number;
  atualizadoEm: number;
  total: number;
}

export interface ItemCarrinho {
  pratoId: string;
  quantidade: number;
  notas?: string;
}
