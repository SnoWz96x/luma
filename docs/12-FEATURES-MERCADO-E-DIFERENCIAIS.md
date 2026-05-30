# LUMA — Features de Mercado, Open Source & Diferenciais Únicos

Pesquisa de mercado/open source para tornar o LUMA **único**. Tudo adaptado à
filosofia: sem culpa, sem barras, bem-estar não-clínico, offline-first, privacidade.

Prioridade: 🔴 MVP+ · 🟡 próximo · 🟢 futuro. Cada item aponta a engine.

## 1. Ciclo de vida & crescimento do bichinho (Tamagotchi/Digimon/Finch)
Referências: Tamagotchi (ovo→bebê→criança→adolescente→adulto, forma depende do
cuidado), Digimon (evolução ramificada por cuidado/treino), Finch (cresce com autocuidado).

- 🔴 **Estágios de vida**: `egg → baby → child → teen → adult` + `elder` (opcional).
  O **estágio é sentido** (tamanho, proporção, detalhes), nunca uma barra de XP.
- 🔴 **Ritual de eclosão (ovo)**: onboarding vira "chocar o ovo" — primeiro vínculo.
- 🟡 **Evolução ramificada por estilo de vida** (não só tempo): criativo / aventureiro
  / sereno / social → formas adultas diferentes (já temos `EvolutionTrigger` por traço).
- 🟡 **Care-quality**: consistência de hábitos/carinho influencia o "ramo" final
  (inspiração Digimon, mas **sem punir** — ausência só atrasa, nunca degrada).
- 🟢 **Marcos de crescimento** geram memória + item comemorativo.

## 2. Mini-games (cozy, sem game-over) — Activity Engine
Referências: Finch (adventures, breathing), Neko Atsume, Stardew (pesca/colheita).

- 🟡 **Respiração guiada** — bolha que infla/esvazia; o pet respira junto (autocuidado).
- 🟡 **Brincar/pega-varinha** — interação rápida que dá humor + fagulhas.
- 🟡 **Pescaria cozy** — minigame relaxante de timing simples → itens/coleção.
- 🟡 **Jardim** — plantar/regar; cresce conforme seus hábitos (liga ao mundo espelho).
- 🟢 **Caça ao tesouro / passeios** — o pet "sai" e volta com achados (Finch adventures).
- 🟢 **Montar constelações** — quebra-cabeça leve com memórias.

## 3. Badges & Conquistas — Achievement Engine
Referências: Duolingo (streak + streak freeze), boas práticas 2025 (recompensa
significativa, surpresa, sem dark patterns).

- 🟡 **Badges de marcos**: primeira semana juntos, 10 check-ins, primeira evolução,
  primeiro hábito de 7 dias. **Nunca expiram, nunca comparam socialmente.**
- 🟡 **Streak com proteção gentil** ("dia de folga"/streak freeze) — quebrar não pune;
  oferece retomar sem drama (alinhado à Safety Layer).
- 🟡 **Conquistas-surpresa** por carinho/exploração (descoberta, não obrigação).
- 🟢 **Linha do tempo de conquistas** (revisitar a jornada).
- ⚙️ Toggle global para ocultar gamificação (quem não curte).

## 4. Skins & Customização
Referências: Finch (cores/roupas/birbhouse), Animal Crossing, cozy 2025 (+350 itens).

- 🟡 **Skins/paletas do pet** desbloqueáveis (variações de cor sobre o DNA kawaii).
- 🟡 **Acessórios** (chapéu, cachecol, óculos) — `items type='clothing'`.
- 🟡 **Decoração do quarto/mundo** — móveis/plantas; arrastar e posicionar.
- 🟢 **Temas de ambiente** (paletas/molduras) e **soundscapes** desbloqueáveis.
- 🟢 **Galeria comunitária** (pipeline openpets, MIT) — enviar pets/skins.

## 5. Economia suave — Economy
Referência: Finch (Rainbow Stones), Neko Atsume (peixe/ouro).

- 🟡 **Fagulhas** (moeda gentil) ganhas por autocuidado/check-in; gastas só em cosméticos.
- ❌ Sem pay-to-win, sem pressão de compra, sem economia entre usuários.

## 6. Integração com IA (local-first) — AI Engine (ampliar)
Referências: desktop pets com LLM local (Tincat, live2d + LLM), privacidade.

- 🔴 **MockProvider** (feito) + **LocalOllamaProvider** (feito) — 100% local.
- 🟡 **Seletor de modelo/provider** nas configurações (Phi-3, Llama 3.2, Gemma…).
- 🟡 **Memória viva no prompt** (feito no core) + **resumos** quando a conversa cresce.
- 🟡 **Fala proativa gentil** (o pet comenta o dia/hábitos) — opt-in, sem spam.
- 🟢 **Voz (TTS) opcional** e **reconhecimento de fala** (acessibilidade).
- 🟢 **"Sonhos" do pet** durante ausência (IA gera mini-eventos → memória de saudade boa).

## 7. Presença no desktop — Notification/Presence
Referências: lil-agents, openpets, live2d.

- 🟡 **Pet anda/visita** cantos da área de trabalho (modo flutuante Tauri).
- 🟡 **Modo foco / companhia silenciosa** (Pomodoro suave).
- 🟡 **Nudges gentis** (água, respirar, alongar) — opt-in, sem culpa.
- 🟢 **Reage à atividade** (fica quietinho quando você está concentrado).

## 8. O que nos torna ÚNICOS (a tese do LUMA)
Combinação que ninguém junta hoje:

1. **Ser vivo no desktop + web sincronizados** (não é app de celular, não é só chat).
2. **Mundo espelho**: a vida do usuário vira paisagem (flores, pontes, vaga-lumes,
   constelações de memória) — progresso **sentido**, sem números.
3. **Evolução pela vida real do usuário** (traços), não por grind de XP.
4. **IA 100% local + memória/relacionamento persistentes** = companhia que conhece você.
5. **Ética no núcleo**: Safety Layer obrigatória, rede de apoio real, sem dependência.
6. **Privacidade radical**: tudo local, exportável/apagável.

> Nenhum concorrente (Finch=mobile/sem desktop, Replika=chat/sem mundo,
> Tamagotchi=sem IA/memória, desktop pets=sem bem-estar/memória) cobre os 6.

## Plano de implementação (ordem sugerida)
```
Fase 3  ── Habit Engine + Achievement Engine (badges/streak protegido)
        └─ Growth/Life-stage (egg→adult) ligado à Evolution já existente
Fase 3.5 ─ Activity Engine: respiração + brincar (2 minigames cozy)
Fase 4  ── Economy (fagulhas) + Skins/itens + decoração
Fase 4.5 ─ Mundo espelho v1 + constelações de memória
Fase 5  ── Web sync + Help Hub (BrazilProvider) ligado à Safety
Polish  ── TTS, sonhos do pet, galeria comunitária
```

## Novas engines a criar (modulares, opt-in)
- **Growth Engine** (estágios de vida + ramo de evolução)
- **Achievement Engine** (badges, streak protegido)
- **Activity Engine** (mini-games cozy)
- **Economy** (fagulhas, só cosmético)

Sources:
- https://en.wikipedia.org/wiki/Tamagotchi
- https://en.wikipedia.org/wiki/Digimon
- https://www.thegamer.com/best-virtual-pet-games-ranked/
- https://github.com/Easedom/awesome-desktop-pets
- https://medium.com/@opensourceforyou/best-5-open-source-ai-pet-robots-virtual-companions-in-2025-9e7d59a59e8d
- https://www.solulab.com/psychology-behind-streaks-habit-apps/
- https://www.plotline.so/blog/gamification-best-practices
