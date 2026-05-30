# LUMA — Status Atual (snapshot)

Resumo do que está **construído e testado** vs. o que vem a seguir.

## ✅ Pronto e testado (76 testes, type-check limpo)

### Domínio puro (`packages/core`)
- **Tamagotchi Engine** — estados vitais, decay/regen, sinais sensoriais (sem barras).
- **Safety Layer** — inspeção de entrada/saída, regras inquebráveis, oferta de recursos.
- **AI Engine** — `AIProvider` + `MockProvider` + `LocalOllamaProvider` (local) + prompt builder.
- **Memory Engine** — extração + ranking de memórias importantes.
- **Relationship Engine** — amizade/confiança/familiaridade + estágios.
- **Growth Engine** — ciclo de vida (egg→baby→child→teen→adult→elder), care-quality,
  ramo de evolução por estilo de vida; nunca pune ausência.
- **Achievement Engine** — badges + streak com proteção gentil (streak freeze).

### Dados (`packages/characters`)
- 100 personagens gerados (14 categorias, inclui monstros/dragões/cães corajosos).
- Renderizador SVG kawaii animado (5 estados) reutilizável Desktop/Web.

### App Desktop (`apps/desktop`) — Tauri + React + Zustand + Tailwind
- Onboarding (adoção + nome) com visual repaginado (design system cozy).
- Casa: pet animado, cena reativa (clima/paleta/luz), barra de interações.
- Conversar: chat com Safety + Memory + Relationship (MockProvider).
- Conquistas: painel de badges + celebração + streak no header.
- Crescimento: estágio de vida no header e tamanho do pet por estágio.
- Persistência: estado vital (SQLite via Tauri / memória no browser),
  progresso e adoção (localStorage no MVP).
- **App nativo de PC** via Tauri (janela transparente, sempre-no-topo).

## 🔜 Próximo (ver docs/12)
- **Activity Engine** — mini-games cozy (respiração guiada, brincar, pescaria).
- **Economy** — fagulhas (moeda gentil) + loja cosmética.
- **Skins & itens** — paletas/acessórios/decoração do quarto.
- **Mundo espelho v1** — flores/pontes/vaga-lumes + constelações de memória.
- **Web sync** + **Help Hub (BrazilProvider)** ligado à Safety Layer.
- **Polish** — TTS, "sonhos" do pet, galeria comunitária, persistência total em SQLite.

## Como rodar
- **Web (preview rápido):** `pnpm --filter @luma/desktop dev` → http://localhost:1420
- **App de PC (nativo):** `pnpm --filter @luma/desktop tauri dev`
  (requer Rust — já instalado neste ambiente). 1ª compilação demora (compila ~600 crates).
- **Testes:** `pnpm -r test` · **Type-check:** `pnpm -r typecheck`
- **Gerar personagens:** `pnpm --filter @luma/characters generate`
- **Galeria visual:** `pnpm --filter @luma/characters gallery`
