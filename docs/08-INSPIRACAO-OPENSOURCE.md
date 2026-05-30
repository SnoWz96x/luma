# LUMA — Inspiração Open Source

Estudo dos projetos de referência. Princípio: **estudar e inspirar, nunca copiar**.
Qualquer reuso de código respeita a licença e dá atribuição.

## openpets — `alvinunreal/openpets` (MIT)
Desktop pet para agentes de código; pet idle que reage, sprite sheets, galeria
comunitária, nudges/foco.

**Reuso possível (MIT, com atribuição):**
- Pipeline de **sprite sheet** padronizado para personagens.
- Modelo de **galeria comunitária** ("desenhe seu pet → suba") → escala 100 → milhares.
- **State machine idle/react** como base da Character/Tamagotchi Engine.
- Conceito de **ambient check-ins / break nudges / focus timer** → vira lembrete
  gentil de hábito (água, respirar, alongar) **sem culpa**.

**Descartado:** integração de status de agentes de código via MCP (uso de dev,
fora do escopo de bem-estar).

## lil-agents-windows — `kimthangk/lil-agents-windows`
Port Windows (Python/PyQt6) do lil-agents. Companheiros que andam acima da taskbar.

**Reuso conceitual (stack diferente → só arquitetura):**
- Janela **transparente, sempre-no-topo**, pet que **anda pela tela**.
- **Clicar no pet → chat popover**.
- **100% local, sem enviar dados** (valida nosso offline-first).

## compapet
⚠️ Repositório/licença não confirmados. **Não reusar** até validar fonte e licença.

## Decisões adotadas
1. Formato de personagem por **sprite sheet** + futura **galeria comunitária**.
2. Pet **anda/visita** cantos da área de trabalho; **modo foco** (companhia silenciosa).
3. **Nudges sensoriais e gentis** ligados a hábitos — nunca a culpa.
4. Reuso de código apenas de fontes **MIT** confirmadas, com atribuição em `NOTICE`.

## Atribuições (quando houver reuso de código)
- Manter arquivo `NOTICE` na raiz listando projeto, autor, licença e o que foi usado.

Sources:
- https://github.com/alvinunreal/openpets
- https://github.com/kimthangk/lil-agents-windows
