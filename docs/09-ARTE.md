# LUMA — Direção de Arte

**Estilo escolhido: Kawaii vetorial (soft).** Cozy, acolhedor, escala para milhares
de personagens e anima de forma suave. Veja exemplos em
[`docs/art/style-preview.html`](art/style-preview.html).

## DNA visual (todos os personagens compartilham)

- Formas **arredondadas**, sem cantos duros.
- **Olhos grandes** e brilhantes (com pontinho de luz), expressivos.
- **Bochechas coradas** (blush) suaves.
- Contornos **macios** (stroke arredondado, sem serrilha).
- Paleta **pastel** + gradiente radial leve para dar volume.
- Boca pequena e simples; emoção vem do corpo todo.

## Formato técnico dos assets

- **Vetor primeiro:** SVG (ou Lottie p/ animações ricas). Vetor = nitidez em
  qualquer DPI e arquivos leves — ideal para o catálogo grande.
- **Viewbox padrão:** `0 0 120 120`, personagem centralizado, "pés" na base.
- **Naming:** `<id>_<estado>` → `luma_idle`, `luma_happy`, `luma_sleep`,
  `luma_curious`, `luma_comfort` (espelha `CharacterDef.animations`).
- **Estados de animação obrigatórios:** `idle`, `happy`, `sleep`, `curious`, `comfort`.

## Animações (sem barras → o usuário SENTE)

Animações são leves e em loop, controladas pelos sinais sensoriais
(`SensorySignals`) derivados dos estados vitais:

| Sinal | Efeito visual |
|-------|---------------|
| `pace` baixo / energia baixa | respira devagar, boceja, luz mais fraca |
| `mood` alto | salta, olhos fecham em sorriso, cores mais quentes |
| `closeness` alto (vínculo) | pet se aproxima da tela |
| `curiosity` | olha ao redor, segue o cursor |
| clima `soft_rain` | pet aconchegante, paleta mais fria |

Técnicas: `float` (sobe/desce), `pisca`, `squash & stretch` no salto,
transição de paleta por humor. Base em CSS/transform + Lottie quando preciso.

## Paleta base (referência)

- Fundo/cena: `#1c1b29` → `#34315a` (gradiente noturno aconchegante).
- Acentos quentes (humor alto): amarelos `#ffcf5c`, rosas `#ff9aa2`.
- Acentos frios (dia difícil): verdes-água `#5fd6a0`, azuis suaves.

## Pipeline (escala)

1. **Template SVG** parametrizável por categoria (animal, robô, slime, nuvem...).
2. Variações por personagem: cor, formato base, detalhes (orelhas, antenas...).
3. **Galeria comunitária** (inspirada no openpets): contribuir um pet = enviar
   SVG/sprite seguindo o template + metadados do `CharacterDef`.
4. Validação `zod` no `packages/characters` antes de entrar no catálogo.

## Não fazer
- ❌ Realismo, sombras pesadas, detalhamento excessivo.
- ❌ Expressões agressivas/tristeza extrema que gerem culpa (ver Safety Layer).
