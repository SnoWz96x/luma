# LUMA — REUSE MATRIX (V3)

> Decisão explícita de **reusar / adaptar / inspirar / construir** por capacidade.
> "Reusar" = código (licença compatível + `NOTICE`). "Adaptar" = reescrever a
> ideia em TS puro. "Inspirar" = só conceito. "Construir" = original do LUMA.

| Capacidade | Decisão | Fonte | Notas |
|------------|---------|-------|-------|
| Sprite/asset de personagem | **Adaptar** | OpenPets (MIT) | manifesto compatível p/ galeria; render SVG é nosso |
| Galeria comunitária | **Adaptar** | OpenPets | via Plugin Engine (Sprint D) |
| Janela transparente / pet anda | **Inspirar** | lil-agents, Desktop Goose | implementação Tauri própria |
| Balanceamento de vitais | **Inspirar** | Tama96/Termagotchi | já temos curva própria testada |
| Memory tiers (curto/longo/emocional) | **Adaptar** | MemGPT/Letta | TS puro enxuto no `core/memory` |
| Recuperação de memória (relevância) | **Adaptar** | LlamaIndex (conceito) | ranking próprio; RAG local é futuro |
| Orquestração de chat | **Inspirar** | LangGraph | máquina de estados simples própria |
| Múltiplos agentes (família) | **Inspirar** | AutoGen | V2 |
| Heurística de humor textual | **Adaptar** | mentalHealth_analysis | só TOM, jamais diagnóstico (Safety) |
| Exercícios de bem-estar | **Construir** | (conceito Wysa/Finch) | respiração ✅; jardim/pescaria a construir |
| Mood tracking/insights | **Construir** | (conceito Daylio) | sem barras; insights gentis |
| Prompts de reflexão (diário) | **Construir** | (conceito Stoic/Reflectly) | opcional |
| Eventos sazonais | **Construir** | (conceito Animal Crossing) | Event Engine determinístico |
| Recursos de crise BR | **Construir** | dados públicos oficiais | CVV/CAPS/SUS/UPA/SAMU ✅ |
| IA local | **Reusar** | Ollama (API HTTP) | já integrado |
| Providers cloud | **Construir** | atrás do contrato `AIProvider` | OpenAI/Anthropic/Gemini opt-in |

## Princípios de reuso
- Nada entra sem licença compatível confirmada.
- Preferir **adaptar enxuto em TS puro** a importar dependências pesadas (mantém
  o `core` testável e offline-first).
- Toda fonte reusada → linha em `NOTICE` (projeto, autor, licença, o que foi usado).
