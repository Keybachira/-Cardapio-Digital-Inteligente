# Kianda — Cardápio Digital (Protótipo)

Protótipo 100% front-end em Next.js 16, com dados mock e "backend" simulado em
localStorage + BroadcastChannel (para sincronização em tempo real entre abas,
sem servidor).

## Como correr

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Como testar o fluxo completo

1. Abre a página inicial `/` — mostra os QR das mesas de demonstração
2. Clica numa mesa (ou abre `/menu/mesa-1`) para simular o cliente a escanear o QR
3. Escolhe pratos, envia o pedido — és redirecionado para `/conta/mesa-1` (a conta em tempo real)
4. **Abre uma segunda aba/janela** em `/admin` (qualquer credencial entra) → Pedidos
   — vais ver o pedido a chegar sozinho ao painel da cozinha, sem recarregar a página
5. Avança o pedido pelas colunas (Novo → Em preparo → Pronto → Servido) e repara
   que o estado muda ao vivo também na aba do cliente em `/conta/mesa-1`
6. Em `/admin/cardapio` podes ativar/desativar pratos ou adicionar um "prato do dia" —
   volta à aba do menu do cliente e vê a mudança instantânea

## Estrutura

- `lib/mock-data.ts` — restaurante fictício "Kianda" (Benguela), cardápio e mesas
- `lib/store.ts` — camada de dados mock (localStorage) com sincronização entre abas
- `app/menu/[mesa]` — cardápio do cliente
- `app/conta/[mesa]` — conta em tempo real (substitui a folha de papel)
- `app/admin/*` — painel: pedidos (KDS), cardápio (CRUD), mesas

## Próximo passo (fora do protótipo)

Trocar `lib/store.ts` por chamadas reais a uma base de dados com realtime
(ex. Supabase), mantendo os mesmos componentes de UI.
