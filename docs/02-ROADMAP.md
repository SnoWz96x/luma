# LUMA — Roadmap

Princípio: **vertical slices** que funcionam de ponta a ponta, não camadas
horizontais incompletas. Cada fase entrega algo que o usuário sente.

## Fase 0 — Fundação ✅ (atual)
- [x] Documento de arquitetura
- [x] Roadmap
- [x] Modelo de dados (SQLite + PostgreSQL)
- [x] Estrutura do monorepo
- [ ] Scaffolding dos workspaces (`packages/*`, `apps/*`)
- [ ] Schema dos personagens + gerador dos 100

## Fase 1 — MVP "Ele está vivo" (núcleo)
Objetivo: um pet que mora na tela, tem estado vital e reage.

1. **Desktop Pet** — janela Tauri transparente, sempre-no-topo, personagem animado
2. **Character Engine** — carregar 1 personagem, sprites, idle/animações básicas
3. **Tamagotchi Engine** — estados vitais + decay no tempo + persistência SQLite
4. **World Engine v0** — um cenário (quarto) que muda com o humor
5. **Daily Mood** — check-in diário simples (sem barras → sinais visuais)

**Critério de pronto:** abrir o app, ver o pet, ele reage ao tempo e ao humor do dia.

## Fase 2 — MVP "Ele me conhece" (memória + IA)
6. **AI Engine** — `MockProvider` → `LocalOllamaProvider` (Phi-3 Mini / Llama 3.2)
7. **Memory Engine** — user_profile, mood_history, important_memories, summaries
8. **Safety Layer** — filtro de entrada/saída (sem diagnóstico, culpa, dependência)
9. **Conversa** — falar com o pet usando contexto (memória+humor+relação)

**Critério de pronto:** conversar com o pet e ele lembra de você e do seu dia.

## Fase 3 — MVP "Nós crescemos juntos" (relação + hábitos)
10. **Relationship Engine** — amizade, confiança, familiaridade evoluindo
11. **Habit Engine** — check-ins, hábitos, missões, streaks, recompensas
12. **Visual Evolution** — pet evolui com base na vida do usuário (não só XP)
13. **World Engine v1** — mundo espelho + constelações de memória + itens desbloqueáveis

**Critério de pronto:** manter hábitos muda visivelmente o pet e o mundo.

## Fase 4 — Espelho na Web (sync)
14. **Backend API** + **PostgreSQL**
15. **Sync Engine** — Local Only / Cloud Sync / Hybrid
16. **Web Platform** — espelho em tempo real (humor, memória, evolução, itens)

**Critério de pronto:** mudanças no Desktop aparecem no site.

## Fase 5 — Rede de Apoio (opcional)
17. **Support Network** — cadastrar contatos de confiança
18. **Emergency Hub** — alertas 100% opt-in, consentimento explícito
19. **Help/Resource Hub** — `BrazilProvider` (CVV, CAPS, SUS, UPA, SAMU...)

**Critério de pronto:** usuário pode pedir apoio sem nunca expor conversas/diário.

## Fase 6 — Privacidade & Polimento
20. Exportar / importar / apagar dados; criptografia local
21. Mais personagens, biomas, animações
22. Onboarding e acessibilidade

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
