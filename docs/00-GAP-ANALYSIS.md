# LUMA — GAP ANALYSIS (V3)

> O que o prompt mestre V3 pede × o que existe hoje (ver [00-CURRENT-STATE](00-CURRENT-STATE.md)).
> Legenda: ✅ feito · 🟡 parcial · ❌ ausente.

## Plataforma & arquitetura
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| Desktop Pet (Tauri) | ✅ | — |
| Engines puras reutilizáveis | ✅ | — |
| Website (landing) | ✅ | `apps/web` (Next.js, 6 páginas) |
| Sync Engine (lógica) | ✅ | `core/sync` (LWW + outbox), testado |
| Backend API + transporte sync | 🟡 | falta `apps/api` (PostgreSQL + HTTP) — ver [16-SYNC-ENGINE](16-SYNC-ENGINE.md) |
| Website sincronizado (espelho real) | ❌ | depende do `apps/api` |
| Plugin Engine | ✅ | `core/plugin` (manifestos + sprites) |

## IA
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| AIProvider / Mock / Ollama | ✅ | — |
| OpenAIProvider / Anthropic / Gemini (opcionais) | ❌ | só Mock+Ollama implementados |
| Model Manager (instalar modelos, RAM/tamanho/qualidade) | ❌ | UI só aponta endpoint/modelo manual |
| AI Orchestrator (escolher modelo automático) | 🟡 | há fallback Mock↔Ollama; falta seleção por hardware |

## Inteligência emocional & memória
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| Emotional Context Engine (stress/energy/motivation/positivity/social_need/confidence) | ✅ | Sprint A — `core/emotion` (não-clínico, ajusta TOM) |
| Memory: short/long/emotional/relationship/world/milestone (camadas) | ✅ | Sprint A — `core/memory/tiers` (relevância+decaimento+resumo) |
| Memórias → estrelas/constelações | ✅ | artefatos genéricos: 🟡 (só estrelas) |
| User traits (perfil aprendido) alimentando IA | 🟡 | tipo existe; pipeline de inferência não roda |

## Personagem & mundo
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| 100 personagens (lore/evolução/bioma/arquétipo) | ✅ | — |
| System Motivator (pet com sonhos/curiosidades/objetivos/projetos) | ✅ | Sprint B — `core/motivator` |
| World Engine (mundo espelho, constelações, evolução visual) | ✅ | — |
| Narrative Engine (histórias contínuas) | ✅ | Sprint B — `core/narrative` (aba 📖 História) |
| Event Engine (Natal/Halloween/aniversários) | ✅ | Sprint B — `core/events` |

## Bem-estar & apoio
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| Diário emocional | ✅ | — |
| Habit Tracker | ✅ | — |
| Minigames | 🟡 | só respiração; faltam outros |
| Safety Layer | ✅ | — |
| Support Network (opcional) | ✅ | — |
| Help Hub (CVV/CAPS/SUS/UPA/SAMU) | ✅ | — |

## Família do pet (V2)
❌ amigos/moradores/visitantes — roadmap V2, não iniciado.

## Documentação
🟡 docs 01-07 existem mas precisam refletir o estado **atual** (growth, achievement,
economy, world, help/support, persistência SQLite, IA Ollama). Atualização pendente.

## Resumo das maiores lacunas (priorizadas)
1. **Emotional Context Engine** — inferência de sinais (sem clínica). Alto valor, baixo custo.
2. **Memory tiers + resumo** (inspiração MemGPT/Letta) — o coração do produto.
3. **System Motivator + Narrative + Event Engine** — "pet vivo" com sonhos e eventos.
4. **Model Manager / AI Orchestrator** — UX da IA local.
5. **Web + API + Sync** — fase 4, maior esforço.
6. **Mais minigames + Plugin Engine** — extensibilidade.
7. **Atualizar docs 01-07.**
