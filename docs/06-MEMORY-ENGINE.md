# LUMA — Memory Engine

O coração do produto. **O valor não está no modelo de IA, está aqui:** memória,
contexto, relacionamento, histórico, personalidade, evolução. A IA é só o gerador.

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
