<div align="center">

<img src="docs/art/icon.svg" alt="LUMA" width="92" />

# Contribuindo com o LUMA 💗

Que bom ter você aqui. O LUMA é um projeto de **bem-estar e companhia** — e a
forma como construímos importa tanto quanto o que construímos.

</div>

---

## 🌱 Antes de tudo: a filosofia

Toda contribuição precisa respeitar os **princípios inegociáveis** do LUMA:

1. **Offline-first** — nada deve exigir internet para funcionar.
2. **Sem barras** — o estado do pet é *sentido* (luz, clima, animação), nunca um número cru na tela.
3. **Sem culpa, sem manipulação** — o pet jamais usa frases como "você me abandonou". Nada de _dark patterns_.
4. **Privacidade radical** — dados são do usuário: locais, exportáveis e apagáveis.
5. **Ética no núcleo** — o LUMA **não** é terapia/diagnóstico. A [Safety Layer](docs/07-SAFETY-LAYER.md) é obrigatória em toda I/O da IA, e sempre incentivamos a conexão humana e a busca por ajuda real.

> Se uma feature é divertida mas fere algum princípio acima, ela **não entra**. 🙏

---

## 🙋 Como você pode contribuir

| Tipo | O que fazer |
|------|-------------|
| 🐛 **Bug** | Abra uma [Issue](../../issues) descrevendo o passo a passo, o que esperava e o que aconteceu. |
| 💡 **Ideia / feature** | Abra uma Issue com a proposta. Conte o *porquê* (qual cuidado/uso ela atende). |
| 💻 **Código** | Procure issues com `good first issue` ou `help wanted`. Comente que vai pegar. |
| 🎨 **Arte / personagens** | Crie um **pack de personagens ou sprites** (veja abaixo). |
| 🌍 **Tradução / acessibilidade** | pt-BR e en são prioridade; libras, leitor de tela, daltonismo são muito bem-vindos. |
| 📖 **Documentação** | Melhorar os docs em [`docs/`](docs/) já ajuda muito. |

---

## 🎨 Criando personagens e sprites (Plugin Engine)

O LUMA é **extensível por plugins** — você não precisa mexer no core para adicionar
conteúdo. Veja [docs/15-ARTE-PIPELINE-HIBRIDO.md](docs/15-ARTE-PIPELINE-HIBRIDO.md).

**Camada 1 — personagem vetorial:** acrescente ao gerador em
[`packages/characters`](packages/characters). Cada personagem tem id, nome, espécie,
categoria, personalidade, frases (sem culpa!), bioma e evolução.

**Camada 2 — sprite/ilustração rica:** registre um `sprite-pack` no Plugin Engine.
Exemplo de manifesto:

```jsonc
{
  "id": "luma-sprites",
  "kind": "sprite-pack",
  "name": "Sprites da Luma",
  "version": "1.0.0",
  "license": "CC-BY-4.0",          // obrigatório p/ arte — vai para o NOTICE
  "data": {
    "sprites": [
      { "characterId": "luma", "frames": { "idle": "luma_idle.png", "happy": "luma_happy.png" } }
    ]
  }
}
```

✅ O `PetView` usa o sprite quando existe e **cai no vetorial** quando não existe —
então nada quebra. Enquadramento padrão: **120×120**, "pés" na base.

> ⚖️ **Licença é obrigatória** em qualquer arte. Só envie conteúdo que você criou
> ou que tem licença compatível. Tudo reutilizado é creditado no [NOTICE](NOTICE).

---

## 🛠️ Ambiente de desenvolvimento

```bash
# 1. Pré-requisitos: Node 18+, pnpm 9+, Rust (rustup), opcional Ollama
pnpm install

# 2. Rodar o app desktop
pnpm --filter @luma/desktop tauri dev

# 3. Antes de commitar — TUDO precisa estar verde:
pnpm -r typecheck
pnpm -r test
pnpm --filter @luma/desktop build
```

### Estrutura
- `packages/shared` — tipos e contratos (sem I/O).
- `packages/core` — **engines puras** (sem framework, sem rede). É aqui que mora a regra de negócio, com testes.
- `packages/characters` — catálogo + renderizador.
- `apps/desktop` — UI (React + Zustand + Tailwind) + Tauri.

---

## ✅ Padrões de código

- **TypeScript estrito** — sem `any` desnecessário; rode `pnpm -r typecheck`.
- **Engines no `core` são puras** — sem `fetch`, sem `localStorage`, sem React. Recebem dados, devolvem decisões. Isso as torna testáveis e reutilizáveis.
- **Teste o que tem regra** — toda lógica nova no `core` vem com teste (Vitest). Buscamos manter a suíte verde (hoje **190+ testes**).
- **Determinismo** — geração de personagens, mundo, pescaria etc. usam seed; mesmo input → mesmo output.
- **Comentários em PT-BR**, curtos, explicando o *porquê*.
- **Estilo** — Prettier. Rode `pnpm exec prettier --write .` no que você tocar.

---

## 🔀 Fluxo de Pull Request

1. **Fork** e crie uma branch: `git checkout -b feat/minha-ideia`
2. Faça as mudanças com **commits claros** (recomendado: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`...).
3. Garanta **typecheck + test + build verdes**.
4. Abra o PR descrevendo: *o que muda*, *por quê*, e *como testar*. Telas/gifs ajudam muito.
5. PRs pequenos e focados são revisados mais rápido. 🙂

---

## 🛟 Conduta

Seja gentil — combina com o projeto. Não toleramos assédio, discurso de ódio ou
qualquer forma de desrespeito. Em conteúdo sensível (saúde mental), redobre o
cuidado e a empatia.

---

<div align="center">
<sub>Obrigado por cuidar do LUMA com a gente. 🌙</sub>
</div>
