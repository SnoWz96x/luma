# LUMA — IMPLEMENTATION PLAN (V3)

> Ordem de execução derivada do [GAP-ANALYSIS](00-GAP-ANALYSIS.md). Cada bloco é
> uma fatia vertical testável. Princípio: **adaptar e integrar**, não recriar.
> Tudo respeita: offline-first, sem barras, sem clínica, Safety Layer no núcleo.

> **STATUS (2026-06-02): Sprints A–E CONCLUÍDOS ✅** — 214 testes, builds limpos.
> A — Emoção+Memória · B — Motivator/Narrative/Events · C — AI Orchestrator/Model
> Manager · D — Plugin Engine+minigame · E — Sync (core+backend+cliente, validado
> end-to-end). Pós-V3 (menor): `PostgresSyncStore`, site espelhar o pull, arte por
> IA via sprite-pack, providers de IA cloud, V2 (família/mobile).

## Sprint A — Inteligência emocional & memória (core, alto valor)
1. **Emotional Context Engine** (`core/emotion`)
   - Infere sinais 0..1: stress, energy, motivation, positivity, social_need, confidence.
   - Fontes: humor do dia, streak, hábitos, palavras da conversa (heurística), vitais.
   - **Sem diagnóstico, sem rótulo clínico.** Alimenta o prompt e o tom do pet.
2. **Memory tiers** (`core/memory`, ampliar)
   - Camadas: short-term (turnos recentes), long-term (importantes), emotional,
     relationship, world, milestone. Inspiração MemGPT/Letta (ver 12-MEMORY-RESEARCH).
   - `summarizeOldTurns()` + decaimento de relevância; orçamento de tokens no prompt.
3. **Trait inference** — pipeline leve que atualiza `user_traits` a partir de sinais.

## Sprint B — Pet vivo (narrativa & eventos)
4. **System Motivator** (`core/motivator`) — pet com sonhos/curiosidades/objetivos;
   gera falas proativas gentis (opt-in).
5. **Narrative Engine** (`core/narrative`) — micro-histórias contínuas ligadas à jornada.
6. **Event Engine** (`core/events`) — datas (Natal, Halloween, Ano Novo, aniversários
   do usuário e do pet) mudam cena/itens/falas. Determinístico por data.

## Sprint C — IA local madura
7. **AI Orchestrator** — escolher modelo por hardware/latência; preparar
   OpenAI/Anthropic/Gemini providers (opt-in, atrás do contrato existente).
8. **Model Manager** (UI) — listar/baixar modelos Ollama, mostrar RAM/tamanho/qualidade.

## Sprint D — Extensibilidade & minigames
9. **Plugin Engine** — registrar personagens/mundos/eventos/minigames por manifesto.
10. **Activity Engine v2** — +minigames cozy (pescaria, jardim, brincar).

## Sprint E — Web + Sync (fase 4)
11. **apps/api** (backend + PostgreSQL) + **Sync Engine** (local/cloud/hybrid).
12. **apps/web** (Next.js) — espelho em tempo real.

## Transversal (contínuo)
- **Atualizar docs 01-07** ao fim de cada sprint para refletir o código real.
- Manter type-check + build + testes verdes **antes de cada commit**.

## Decisão de execução imediata
Começar pelo **Sprint A** (Emotional Context Engine + Memory tiers): maior valor
por esforço, 100% no core (testável), e fortalece o diferencial do LUMA
(memória/contexto/relacionamento). Não depende de Web/API.
