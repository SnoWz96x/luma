# LUMA — Roadmap Unificado de Features

Consolida **tudo** que já mapeamos: docs [10](10-FEATURES-E-LACUNAS.md),
[11](11-CATALOGO-DE-FEATURES.md), [12](12-FEATURES-MERCADO-E-DIFERENCIAIS.md) +
pesquisa de mercado/open source. Fonte única de verdade para o que construir.

Legenda: ✅ feito · 🔨 em construção · 🔜 próximo · 🟢 futuro

## ✅ JÁ CONSTRUÍDO (76 testes, app nativo + web preview)
- Tamagotchi Engine (estados, decay, sinais sensoriais sem barras)
- Character Engine + 100 personagens (14 categorias) + renderizador animado
- Safety Layer · AI Engine (Mock + Ollama local) · Memory · Relationship
- **Growth Engine** (egg→elder, care-quality, ramo por estilo de vida)
- **Achievement Engine** (badges + streak com proteção gentil)
- App desktop: onboarding, casa, chat, conquistas, crescimento, design system cozy
- App nativo de PC (Tauri, janela transparente)

## 🔨 EM CONSTRUÇÃO (Fase 3 — já iniciada)
| Feature | Origem | Engine |
|---------|--------|--------|
| Crescimento visual ligado à vida | doc10/12 | Growth (✅ core, ligar evolução do sprite) |
| Badges + streak | doc11/12 | Achievement (✅) |

## 🔜 PRÓXIMO (Fase 3.5–4) — ordenado por impacto
| # | Feature | Origem | Engine/Local |
|---|---------|--------|--------------|
| 1 | **Hábitos + check-in diário** (beber água, respirar, caminhar…) | doc10/11 | Habit Engine (novo) |
| 2 | **Mini-game: respiração guiada** (bolha; pet respira junto) | doc11/12 | Activity Engine (novo) |
| 3 | **Mini-game: brincar** (bola/varinha) | doc11/12 | Activity Engine |
| 4 | **Economia suave (fagulhas)** + loja cosmética | doc11/12 | Economy (novo) |
| 5 | **Skins/paletas do pet** desbloqueáveis | doc11/12 | World/Inventory |
| 6 | **Acessórios** (chapéu, cachecol, óculos) | doc11 | Inventory |
| 7 | **Decoração do quarto** (móveis/plantas, arrastar) | doc11 | World |
| 8 | **Diário digital** (entradas → memórias) | doc10/11 | Memory (ampliar) |
| 9 | **Nudges gentis** (água/respirar) opt-in, sem culpa | doc10/11 | Notification (novo) |
| 10 | **Evolução visual do sprite por estágio/ramo** | doc05/12 | Character/Growth |

## 🟢 FUTURO (Fase 4.5+)
| Feature | Origem |
|---------|--------|
| **Mundo espelho v1** (flores/pontes/árvores/vaga-lumes) | doc10 (visão original) |
| **Constelações de memória** (estrelas revisitáveis) | doc10 |
| Mini-games: pescaria cozy, jardim, caça ao tesouro | doc11/12 |
| Álbum de visitantes + mementos (Neko Atsume-like) | doc11 |
| Eventos sazonais + ciclo dia/noite real | doc11/12 |
| **Sonhos do pet** durante ausência (IA → memória) | doc10/12 |
| Modo foco / companhia silenciosa (Pomodoro) | doc10/12 |
| Pet anda/visita cantos da área de trabalho | doc12 |
| TTS (voz do pet) + reconhecimento de fala | doc11/12 |
| Soundscapes cozy desbloqueáveis | doc11 |
| **Web sync** (espelho em tempo real) | briefing |
| **Support Network + Emergency Hub + Help Hub (BrazilProvider)** | briefing/doc07 |
| Seletor de modelo de IA (Phi-3/Llama/Gemma) | doc12 |
| Galeria comunitária de pets/skins (pipeline openpets) | doc08/12 |
| Família do pet (amigos/moradores, Animal Crossing-like) | briefing V2 |
| Time-lapse da jornada | doc10 |
| Privacidade: export/import/apagar + criptografia local | briefing |
| Mobile sincronizado | briefing |

## Engines novas a criar (todas modulares, opt-in)
- ✅ Growth Engine · ✅ Achievement Engine
- 🔜 **Habit Engine** · **Activity Engine** (mini-games) · **Economy** · **Notification**
- 🟢 World Engine (mundo espelho) · Audio · Sync · Support/Emergency/Help

## Princípios inegociáveis (valem para toda feature)
1. Opcional por padrão · sem punição/FOMO/comparação social.
2. Estado é **sentido**, não lido (sem barras numéricas).
3. Offline-first + privacidade radical (local, exportável, apagável).
4. Safety Layer envolve toda I/O de IA.
5. Reuso do `packages/core` entre Desktop/Web/Mobile.

## A tese ÚNICA do LUMA (o que ninguém junta)
Ser vivo no **desktop+web sincronizados** + **mundo espelho** + **evolução pela
vida real** + **IA local com memória/relacionamento** + **ética no núcleo** +
**privacidade radical**. Ver doc12 §8.
