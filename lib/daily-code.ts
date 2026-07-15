const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TAMANHO_CODIGO = 4;

function hashSimples(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gerarCodigoMesa(mesaId: string, data?: Date): string {
  const d = data ?? new Date();
  const dataStr = d.toISOString().slice(0, 10);
  const base = `${mesaId}:${dataStr}:kianda`;
  const hash = hashSimples(base);
  let codigo = "";
  for (let i = 0; i < TAMANHO_CODIGO; i++) {
    codigo += CARACTERES[hash % CARACTERES.length];
    // Use different parts of hash for each character
  }
  return codigo;
}

export function validarCodigoMesa(
  mesaId: string,
  codigo: string,
  data?: Date
): boolean {
  if (!codigo || codigo.length !== TAMANHO_CODIGO) return false;
  const esperado = gerarCodigoMesa(mesaId, data);
  return codigo.toUpperCase() === esperado;
}
