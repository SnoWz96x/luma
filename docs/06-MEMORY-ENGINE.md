# LUMA — Memory Engine

O coração do produto. **O valor não está no modelo de IA, está aqui:** memória,
contexto, relacionamento, histórico, personalidade, evolução. A IA é só o gerador.

## v2 — Tiers + relevância + contexto emocional (implementado)
Ver [12-MEMORY-RESEARCH](12-MEMORY-RESEARCH.md) (base MemGPT/Letta) e
[00-IMPLEMENTATION-PLAN](00-IMPLEMENTATION-PLAN.md) (Sprint A).

- **Tiers** (`core/memory/tiers.ts`): `short_term`, `long_term`, `emotional`,
  `relationship`, `world`, `milestone`. `tierOf(memory)` classifica por origem/emoção.
- **Relevância com decaimento** (`relevanceScore`): `importância × decaimento
  temporal × bônus emocional`. Meia-vida por tier — marcos quase não esquecem,
  short-term some rápido. `recallRelevant()` devolve o top-N para o prompt.
- **Resumo do histórico** (`turnsToSummarize`): quando passa de N turnos, os
  antigos são marcados para virar `conversation_summary` (compressão via IA na app).
- **Emotional Context Engine** (`core/emotion/emotion.ts`): infere sinais 0..1
  (stress, energy, motivation, positivity, social_need, confidence) a partir de
  humor/streak/hábitos/vínculo/texto. **Não-clínico** — só ajusta o TOM via
  `emotionToToneHint()`, injetado no system prompt. Ver [07-SAFETY-LAYER](07-SAFETY-LAYER.md).

O chat usa `recallRelevant` (em vez do ranking simples) + `toneHint` a cada mensagem.

---


## Toda resposta considera

```json
{
  "mood": "sad",
  "friendship": 42,
  "favorite_activity": "gaming",
  "sleep": "bad"
}
```

## Estruturas de memória (mapeiam o schema)

- `user_profile` — quem é o usuário (atividade favorita, sono, bio).
- `user_traits` — traços inferidos com peso (alimenta evolução do pet).
- `mood_history` — `moods` ao longo do tempo.
- `habit_history` — `habit_logs` + streaks.
- `relationship_memory` — `relationships` (amizade/confiança/familiaridade).
- `conversation_summaries` — resumos comprimidos do histórico.
- `important_memories` — `memories` com `importance` alta.
- `character_profile` — `CharacterDef` + estágio de evolução.
- `safety_flags` — marcadores de tom (não diagnóstico).

## Montagem de contexto (`buildContext`)

```ts
function buildContext(userId, characterId): PromptContext {
  return {
    profile:      getUserProfile(userId),         // + traits
    todayMood:    getTodayMood(userId),
    relationship: getRelationship(userId, charId),
    character:    getCharacterPersona(charId),
    memories:     topMemories(userId, { limit: 8, by: 'importance' }),
    recentTurns:  lastMessages(conversationId, 12),
    summaries:    relevantSummaries(userId),
    safety:       openSafetyFlags(userId),
  };
}
```

Orçamento de tokens (modelos locais pequenos): persona+regras > memórias
importantes > resumos > turnos recentes. Quando o histórico cresce, gera-se um
`conversation_summary` e descartam-se turnos antigos do prompt (mas não do banco).

## Promoção a "memória importante"

Após cada interação, heurística decide se cria `memories`:
- usuário compartilha fato sobre si (nome, gosto, evento) → importance alta;
- marco de relacionamento / streak de hábito → memória + possível constelação;
- emoção forte detectada → memória com `emotion`.

Memórias importantes podem virar **constelações** (estrelas/objetos revisitáveis)
e elementos do **mundo espelho** (vaga-lumes p/ conversas, árvores p/ amizades).

## Privacidade (requisito, não feature)

Toda memória é **editável, exportável e apagável**. Exportar = JSON/SQLite dump;
apagar = soft delete + purge real. Em Local Only, nada sai da máquina.

## Aprendizado de traços

Pipeline leve (sem fine-tuning): extrai sinais das conversas/hábitos e atualiza
`user_traits.weight` com média móvel. Ex.: muitas menções a desenhar/escrever →
`creative.weight ↑` → Character Engine ramifica evolução criativa.
