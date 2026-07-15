export type Categoria =
  | "entradas"
  | "brasa"
  | "mar"
  | "acompanhamentos"
  | "sobremesas"
  | "bebidas";

export interface Variacao {
  nome: string;
  preco: number;
}

export interface Prato {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // Kz
  categoria: Categoria;
  disponivel: boolean;
  destaque?: boolean; // escolha do chef
  picante?: boolean;
  imagem?: string; // food photo URL
  variacoes?: Variacao[]; // opções tipo tamanho, ponto, complementos
}

export interface Mesa {
  id: string;
  numero: number;
}

export type EstadoPedido = "novo" | "preparo" | "pronto" | "entregue";

export const TRANSICOES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  novo: ["preparo"],
  preparo: ["pronto"],
  pronto: ["entregue"],
  entregue: [],
};

export const MAX_QUANTIDADE = 20;
export const MAX_NOTAS_LENGTH = 200;

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
  pagoEm?: number; // timestamp when paid; absent / undefined means não pago
}

export interface ItemCarrinho {
  pratoId: string;
  quantidade: number;
  notas?: string;
}

export class ErroValidacao extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErroValidacao";
  }
}
