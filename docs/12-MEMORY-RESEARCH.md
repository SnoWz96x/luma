# LUMA — MEMORY RESEARCH (V3)

> Pesquisa de sistemas de memória de agentes para guiar o **Memory Engine v2**.
> O valor do LUMA está aqui (memória/contexto/relacionamento), não no modelo.

## Sistemas estudados (conceitos)
### MemGPT / Letta — memória hierárquica auto-gerida
- **Main context** (na janela do modelo): persona + memória central + turnos recentes.
- **External context** (fora da janela): recall storage (histórico) + archival
  storage (fatos de longo prazo), recuperados sob demanda.
- O agente **edita a própria memória** (promove/rebaixa fatos) e **paginha** o que
  não cabe no contexto. → *self-editing memory* + *paging*.

### LangGraph — estado como grafo
- Estado explícito entre passos; checkpoints. → inspira a orquestração do chat.

### LlamaIndex — indexação/recuperação
- Index + retriever por relevância (embeddings). → futuro RAG local; hoje usamos
  ranking heurístico por importância+recência.

### AutoGen — múltiplos agentes com memórias próprias
- → inspira a **família do pet** (V2): cada criatura com sua memória.

## Tradução para o LUMA (TS puro, offline-first, sem deps pesadas)
Camadas propostas no `core/memory` (v2):

| Tier | Conteúdo | Persistência | No prompt? |
|------|----------|--------------|------------|
| **short-term** | últimos ~12 turnos | memória/sessão | sempre (orçamento) |
| **long-term** | fatos importantes (nome, gostos, conquistas) | SQLite | top-N por relevância |
| **emotional** | memórias com emoção forte | SQLite | quando o tom pedir |
| **relationship** | marcos do vínculo | SQLite | resumo |
| **world** | eventos do mundo espelho | SQLite | resumo |
| **milestone** | crescimento/conquistas | SQLite | resumo |

### Mecanismos a implementar
1. **Ranking de relevância** = `importance * recência * match_emocional` (já temos base).
2. **Resumo por compressão**: ao exceder N turnos, gerar `conversation_summary`
   (via provider de IA) e descartar turnos antigos do prompt (não do banco).
3. **Decaimento gentil**: relevância cai com o tempo, mas memórias-marco não somem.
4. **Orçamento de tokens**: persona+safety > emocional ativo > long-term top-N >
   resumos > short-term.
5. **Self-editing leve**: heurística promove fato repetido a long-term; rebaixa
   trivialidades. Sem o agente reescrever livremente (previsibilidade + safety).

## Princípios
- **Determinístico e testável** onde possível (ranking, orçamento, decaimento).
- **Privacidade**: tudo local, editável e apagável (já garantido pela camada kv/SQLite).
- **Sem embeddings pesados no MVP**: heurística primeiro; RAG local é evolução.

Ver plano de execução em [00-IMPLEMENTATION-PLAN](00-IMPLEMENTATION-PLAN.md) (Sprint A).
