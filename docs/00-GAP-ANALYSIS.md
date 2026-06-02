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
| Backend API + transporte sync | ✅ | `apps/api` (HTTP push/pull) + cliente desktop, validado end-to-end |
| Website sincronizado (espelho real) | 🟡 | API + cliente prontos; falta o site consumir o pull + `PostgresSyncStore` |
| Plugin Engine | ✅ | `core/plugin` (manifestos + sprites) |

## IA
| Capacidade V3 | Estado | Lacuna |
|---------------|--------|--------|
| AIProvider / Mock / Ollama | ✅ | — |
| OpenAIProvider / Anthropic / Gemini (opcionais) | ❌ | só Mock+Ollama implementados |
| Model Manager (RAM/tamanho/qualidade) | ✅ | Sprint C — lista modelos do Ollama + recomenda por RAM (Ajustes) |
| AI Orchestrator (escolher modelo) | ✅ | Sprint C — `core/ai/orchestrator` (catálogo + `pickBestModel`) |

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

## Resumo — Sprints A–E CONCLUÍDOS ✅
1. ~~Emotional Context Engine~~ ✅ Sprint A
2. ~~Memory tiers + resumo~~ ✅ Sprint A
3. ~~System Motivator + Narrative + Event Engine~~ ✅ Sprint B
4. ~~Model Manager / AI Orchestrator~~ ✅ Sprint C
5. ~~Plugin Engine + minigames~~ ✅ Sprint D
6. ~~Sync (core + backend + cliente)~~ ✅ Sprint E (validado end-to-end)

### Lacunas restantes (pós-V3, menores)
- `PostgresSyncStore` (store de sync hoje é em memória — ok p/ dev).
- Site consumir o pull (espelho real do pet na web).
- Providers de IA cloud opt-in (OpenAI/Anthropic/Gemini).
- Arte por IA real via sprite-pack (toggle já pronto).
- V2: família do pet, mobile, criptografia local.
