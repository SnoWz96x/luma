# LUMA — Pipeline de Arte Híbrido

Decisão (com o usuário): **híbrido**. Refinar o renderizador vetorial agora (vale
para os 100 personagens, imediato) e preparar um caminho para **sprites/ilustração
ricos** nos personagens de destaque, via Plugin Engine (Sprint D).

## Camada 1 — Vetorial por código (atual, padrão)
`packages/characters/src/render.ts` — SVG determinístico.
- **Corpo inteiro chibi**: cabeça grande + tronco + braços + pernas (criaturas);
  amorfos (slime/nuvem/fantasma/estrela) mantêm forma única.
- **Cor única por personagem** (derivada do id, dentro da família da categoria).
- **Traços por categoria**: dragão (chifres/asas/cauda), ET (antenas/manchas),
  robô (lata/antena/parafusos), animal (orelhas/focinho), monstro (chifres/dentes),
  planta/cogumelo/mágico.
- Vantagens: leve, anima fácil, escala 100+, custo zero, offline.
- Teto: estilo cartoon vetorial (não "realista").

### Refinos possíveis ainda na camada 1
- Sombreamento suave (segundo gradiente/oclusão), textura leve por categoria.
- Mais expressões (bravo, surpreso, apaixonado) e poses por animação.
- Apêndices animados (cauda/asa balançando) via CSS transform.

## Camada 2 — Sprites/ilustração ricos (futuro, opt-in)
Para ir além do vetorial nos personagens especiais (lendários, mascotes-chave).
- **Formato**: PNG/WebP ou sprite sheet, viewBox/anchor padronizados (mesmo
  enquadramento do SVG: 120×120, "pés" na base).
- **Fonte**: arte própria, bancos kawaii com licença compatível, ou geração por IA
  (com revisão). Sempre registrar licença/autor em `NOTICE`.
- **Integração**: `CharacterDef.animations` já referencia chaves de asset
  (`<id>_idle`, etc.). O `PetView` escolhe: se houver sprite para o personagem,
  usa-o; senão, cai no renderizador vetorial (fallback sempre funciona).
- **Animação**: frames (sprite sheet) ou Lottie para casos ricos.

## Plugin Engine (Sprint D) — como habilita a camada 2
Um manifesto de "pack de personagens" poderá trazer:
```
{ "id": "luma", "sprites": { "idle": "luma_idle.png", ... }, "license": "..." }
```
O loader valida (zod), registra no catálogo e o `PetView` passa a preferir o sprite.
Inspiração de formato: OpenPets (galeria comunitária). Ver 10/11-*.

## Princípio
- O **vetorial é o piso garantido** (todo personagem sempre renderiza).
- Sprites ricos são **camada opcional por cima**, sem quebrar offline-first nem
  exigir asset para os 100 de uma vez.
