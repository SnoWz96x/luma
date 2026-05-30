# LUMA — Character Engine

Suporte a **milhares** de personagens; **100 gerados inicialmente**. O catálogo é
read-only e versionado com o app. A instância do usuário vive em `characters`.

## Schema de um personagem (`CharacterDef`)

```ts
interface CharacterDef {
  id: string;                  // 'luma', 'momo', 'sprout'
  name: string;
  species: string;             // 'gato-estelar', 'slime', 'cogumelo'
  category: CharacterCategory; // ver lista abaixo
  rarity: 'common'|'uncommon'|'rare'|'epic'|'legendary';
  biome: string;               // 'jardim','floresta','espaco','aquario',...
  archetype: string;           // arquétipo emocional: 'o curioso','o tranquilo',...
  personality: {
    traits: string[];          // ['gentil','curioso','sonhador']
    tone: string;              // como fala
    energy: 'calm'|'balanced'|'lively';
  };
  story: string;               // origem curta
  phrases: {
    greeting: string[];
    idle: string[];
    happy: string[];
    sleepy: string[];
    missedYou: string[];       // SEM culpa. Ex: "Que bom te ver de novo."
    encourage: string[];       // incentivo a hábitos/conexão humana
  };
  emotions: string[];          // estados suportados: ['happy','calm','curious',...]
  preferences: { likes: string[]; dislikes: string[] };
  animations: {                // chaves -> assets (sprites/lottie)
    idle: string; happy: string; sleep: string; curious: string; comfort: string;
  };
  evolution: {                 // evolução baseada na VIDA, não só XP
    stages: { id: number; name: string; visual: string }[];
    triggers: EvolutionTrigger[]; // ex: traço 'creative' alto -> ramo criativo
  };
}
```

### Categorias
`animal` · `robot` · `ghost` · `plant` · `dragon` · `alien` · `star` · `slime` ·
`cloud` · `mushroom` · `magical` · `pixel-mascot` · `minimal-mascot`

## Evolução baseada na vida

O personagem **não** evolui só por XP. Ele evolui pelo *modo de viver* do usuário,
lido dos traços (`user_traits`) e do histórico:

| Sinal do usuário | Ramo de evolução do pet |
|------------------|-------------------------|
| Criativo (escreve, desenha) | pet ganha traços/visual criativos |
| Aventureiro (explora, varia hábitos) | pet aventureiro |
| Tranquilo (rotina calma) | pet sereno, cores suaves |
| Social (usa rede de apoio) | pet acolhedor |

Regra: `EvolutionTrigger` combina `trait/weight`, tempo de convivência e
`relationship` — e nunca pune ausência.

## Pet emocional (regras de tom)

- Ausência → **saudade leve**, espera, pequenas mudanças. ✅ "Que bom te ver de novo."
- ❌ NUNCA: "Você me abandonou." Nada de culpa, chantagem ou manipulação.
- Sempre incentivar: conexão humana, hábitos saudáveis, autocuidado, rede de apoio.

## Geração dos 100 (`packages/characters/src/generate.ts`)

Gerador procedural determinístico (seed fixa → reprodutível):

1. Distribui ~7-8 personagens por categoria (13 categorias → 100).
2. Para cada um: nome (banco de nomes curtos e fofos), espécie temática da
   categoria, bioma coerente, arquétipo, raridade (curva: muitos common, poucos
   legendary), personalidade, frases (templates por arquétipo), animações
   (placeholders de asset), trilha de evolução.
3. Valida com `zod` e grava em `data/characters.json`.

Nomes-semente incluem os pedidos: **Momo, Nami, Sprout, Orbit, Bibo, Koko, Tiko,
Vee, Luma, Pingo** (+ banco para os demais).

Ver exemplos prontos em
[`packages/characters/data/sample.json`](../packages/characters/data/sample.json).
