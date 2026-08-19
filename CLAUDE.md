# Tarefa: Onboarding e Planos do Synapse

## Contexto do produto

Synapse é uma plataforma para consultores de investimento simularem, para seus clientes, o
impacto de realocar uma carteira na rentabilidade projetada. Fluxo completo do produto:
empresa contrata → cadastra consultor(es) → consultor cadastra clientes e carteiras →
consultor roda projeções. **Você só vai construir o primeiro passo: a empresa contratando
um plano.**

## Cenários de negócio (já decididos, não altere)

1. **Plano Individual**: a empresa tem um único consultor, que é a própria empresa. Clientes
   ilimitados. Não é possível adicionar mais consultores nesse plano — resolva isso na UI
   (se o usuário tentar, oriente upgrade pro plano Equipe), não só com mensagem de erro.
2. **Plano Equipe**: preço escala com número de consultores E de clientes.
3. **Plano Enterprise**: 10+ consultores, sem preço fixo, botão "Fale com vendas".

## Passo 1 — Raciocine antes de codar (chain-of-thought)

Antes de escrever qualquer código, escreva explicitamente seu raciocínio respondendo:

- Quais campos de estado a tela de Planos precisa?
- Como a regra "individual = no máximo 1 consultor" deve ser refletida na UI sem ser só um
  erro depois do fato?
- Como estruturar `calcularPreco` pura, testável, cobrindo os 3 casos sem ifs aninhados
  difíceis de ler?
- Que estrutura de dados representa a "seleção de plano" que precisa sobreviver da tela de
  Planos até a de Pagamento via localStorage?

Só depois de responder isso, comece a implementar.

## Passo 2 — Modelo de precificação (few-shot)

Use exatamente estes exemplos para derivar e validar `calcularPreco(consultores: number, clientesTotais: number)`:

| Consultores | Clientes totais | Preço/mês | Observação |
|---|---|---|---|
| 1 | ilimitado | R$ 197 | Individual (fixo) |
| 3 | 120 | R$ 397 | Equipe, dentro do pacote base (até 3 consultores/150 clientes) |
| 5 | 210 | R$ 695 | R$397 base + 2 consultores extras (R$89 cada = R$178) + 2 blocos de 50 clientes extras acima de 150 (R$60 cada = R$120) |
| 10 | qualquer | "Fale com vendas" | Enterprise, sem preço fixo |

Regra geral implícita: base R$397 cobre até 3 consultores e 150 clientes; cada consultor
extra soma R$89; cada bloco adicional (ou fração) de 50 clientes acima de 150 soma R$60. A
partir de 10 consultores, não calcule preço — mostre "Fale com vendas".

Essas faixas foram calibradas com base em preços reais de SaaS B2B por assento no Brasil
(monday CRM R$66–154/usuário/mês), ajustadas para cima por ser uma ferramenta vertical
especializada em simulação financeira.

## Passo 3 — Telas

1. **`/planos`**: 3 cards (Individual, Equipe, Enterprise). No card Equipe, stepper de nº de
   consultores (min 2, max 9) e input de nº de clientes estimado; preço recalcula em tempo
   real via `calcularPreco`. Botão "Continuar" salva a seleção em
   `localStorage["synapse:selectedPlan"]` e navega para `/login`.
2. **`/login`**: formulário de e-mail/senha **sem nenhuma lógica de validação ou
   autenticação** — qualquer clique em "Entrar" navega para `/pagamento`. Badge visível:
   "Simulação — sem autenticação real".
3. **`/pagamento`**: mostra o resumo do plano escolhido (lido do localStorage) e um
   formulário de pagamento fake (nº cartão, validade, CVV) **sem nenhuma lógica/validação/
   processamento**. Botão "Confirmar" mostra um estado de sucesso mock. Badge visível:
   "Simulação — nenhum dado é processado ou salvo".

## REQUISITOS TÉCNICOS OBRIGATÓRIOS DO TRABALHO (não pular nenhum)

Este código vai para o repositório final entregue e avaliado. Gere/atualize um `README.md`
com exatamente esta estrutura, nesta ordem:

1. O que o Synapse faz e qual módulo esta entrega cobre (onboarding e planos, feature da
   Escola de TI).
2. O system prompt completo usado — cole o conteúdo de `CLAUDE.md` na íntegra.
3. A técnica de prompt engineering aplicada: Chain-of-Thought (principal) e Few-shot
   (na definição de preços), com justificativa: CoT porque a regra de preço/limite por
   plano é uma decisão de trade-off arquitetural (mesmo racional de WEI et al., 2022,
   citado no material da disciplina); few-shot porque ancorar exemplos concretos de
   entrada/saída da função de preço garante consistência de cálculo, algo arriscado de
   obter só com instrução em prosa. Marcador `<!-- INSERIR PRINT do raciocínio CoT gerado -->`.
4. Seção "Teste de curadoria de contexto": deixe a estrutura da tabela pronta (arquivo
   inteiro vs. trecho relevante, tokens de cada abordagem), marcador
   `<!-- PREENCHER após protocolo pós-build -->`. Não invente esses números — vêm de um
   teste real feito depois, fora desta sessão.
5. Tabela de todas as chamadas desta sessão: tokens de entrada, tokens de saída, custo
   estimado por chamada, custo total. Marcador `<!-- PREENCHER com dados do /cost -->`.
6. Marcador para print/export do dashboard ou log da ferramenta usada.
7. Marcador `<!-- PREENCHER: URL publicada pela equipe de deploy -->`.
8. Marcador `<!-- PREENCHER: nomes e RA dos integrantes -->`.

Além disso:

- `git init` no início; `.gitignore` com `.env`/`node_modules` **antes do primeiro commit**.
- Commits pequenos e descritivos por etapa (scaffold, pricing, tela de planos, telas mock,
  README).
- **Não configure deploy** (Vercel/Pages/Actions) — isso é responsabilidade de outra parte
  do time.
