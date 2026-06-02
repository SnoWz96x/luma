# LUMA — Roadmap

Princípio: **vertical slices** que funcionam de ponta a ponta, não camadas
horizontais incompletas. Cada fase entrega algo que o usuário sente.

> **Status (2026-06-02):** Fases 1–3 e Sprints A–D concluídos. App desktop com 12
> abas + site web com 6 páginas. 196 testes. Único grande pendente: **Fase 4
> (Web sincronizada + Backend + Sync)**. Veja [00-CURRENT-STATE](00-CURRENT-STATE.md).

## Fase 0 — Fundação ✅
- [x] Arquitetura, Roadmap, Modelo de dados (SQLite + PostgreSQL)
- [x] Estrutura do monorepo + scaffolding dos workspaces
- [x] Schema dos personagens + gerador dos 100

## Fase 1 — "Ele está vivo" ✅
- [x] Desktop Pet (janela Tauri transparente, personagem animado)
- [x] Character Engine (100 personagens + renderizador SVG por categoria)
- [x] Tamagotchi Engine (estados vitais + decay + persistência SQLite)
- [x] World Engine v0 (cena que muda com o humor) · Daily Mood (sem barras)

## Fase 2 — "Ele me conhece" ✅
- [x] AI Engine (`MockProvider` + `LocalOllamaProvider`)
- [x] Memory Engine (extração + tiers + relevância/decaimento)
- [x] Safety Layer (filtro entrada/saída, sem diagnóstico/culpa)
- [x] Conversa com contexto (memória + humor + relação)

## Fase 3 — "Nós crescemos juntos" ✅
- [x] Relationship Engine (amizade/confiança/familiaridade)
- [x] Habit Engine (check-ins, hábitos, streaks, recompensas)
- [x] Visual Evolution (ovo→adulto + ramo pela vida; crescimento sentido)
- [x] World Engine v1 (mundo espelho + constelações de memória)

## Sprints A–D (plano V3) ✅
- [x] **A** — Emotional Context Engine + Memory tiers
- [x] **B** — System Motivator + Narrative + Event Engine
- [x] **C** — AI Orchestrator + Model Manager
- [x] **D** — Plugin Engine (arte híbrida/sprites) + minigame de pescaria

## Fase 5 — Rede de Apoio ✅
- [x] Support Network (contatos de confiança)
- [x] Emergency Hub (alertas 100% opt-in)
- [x] Help/Resource Hub — `BrazilProvider` (CVV, CAPS, SUS, UPA, SAMU)

## Fase 6 — Privacidade & Polimento ✅ (parcial)
- [x] Exportar / importar / apagar dados (aba Ajustes)
- [x] Site web (6 páginas) + README/CONTRIBUTING/logo/topics
- [ ] Criptografia local opt-in · acessibilidade fina · screenshots reais

## Fase 4 — Espelho na Web (sync) ⏳ PRÓXIMO
14. **Backend API** (`apps/api`) + **PostgreSQL**
15. **Sync Engine** — Local Only / Cloud Sync / Hybrid
16. **Web Platform** — espelho em tempo real (humor, memória, evolução, itens)

**Critério de pronto:** mudanças no Desktop aparecem no site.

## Roadmap V2 (pós-MVP)
- Família do pet (amigos, moradores — estilo Animal Crossing)
- Mobile (sincronizado)
- Mais providers de IA e modelos
- `USProvider` / `EuropeProvider` no Help Hub

## Explicitamente FORA do MVP
- ❌ Multiplayer
- ❌ Marketplace
- ❌ Economia complexa
- ❌ Feed social
- ❌ Fine-tuning de modelos

## Ordem de implementação técnica recomendada
```
packages/shared (tipos) → packages/db (schema) → packages/core (engines)
   → apps/desktop (UI + repositórios SQLite) → IA local
   → packages/characters → apps/api + sync → apps/web
```
