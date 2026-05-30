# LUMA — Arquitetura

## 1. Visão de Sistema

LUMA é um ecossistema **offline-first** com sincronização opcional. O cérebro do
produto vive **localmente** (Desktop) e a nuvem é apenas um espelho opcional.

```
┌──────────────────────────────────────────────────────────────────────┐
│                              USUÁRIO                                   │
└───────────────┬───────────────────────────────────┬──────────────────┘
                │                                     │
        ┌───────▼────────┐                    ┌───────▼────────┐
        │  DESKTOP APP    │                    │   WEB PLATFORM  │
        │  Tauri + React  │                    │    Next.js      │
        │  (fonte da      │                    │  (espelho /     │
        │   verdade local)│                    │   leitura)      │
        └───────┬─────────┘                    └───────┬─────────┘
                │                                       │
        ┌───────▼─────────┐                             │
        │   SQLite local  │                             │
        │  (cérebro)      │                             │
        └───────┬─────────┘                             │
                │                                       │
                │        ┌──────────────────┐           │
                └───────►│   SYNC ENGINE     │◄──────────┘
                         │ Local/Cloud/Hybrid│
                         └────────┬──────────┘
                                  │ (opcional)
                         ┌────────▼──────────┐
                         │   BACKEND API     │
                         │   PostgreSQL      │
                         └───────────────────┘
```

### Princípio central
O **Desktop App é a fonte da verdade**. A nuvem só recebe o que o usuário
autorizar. No modo `Local Only` (padrão), o Backend API nunca é contatado.

## 2. As 12 Engines / Subsistemas

Cada engine é um módulo isolado em `packages/core`, **puro** (sem I/O direto),
testável e reutilizável entre Desktop, Web e Mobile.

| # | Engine | Responsabilidade |
|---|--------|------------------|
| 1 | **Character Engine** | Catálogo de personagens, definições, evolução visual |
| 2 | **Tamagotchi Engine** | Estados vitais (energia, humor, sono, vínculo...) e seu decay/regen |
| 3 | **Memory Engine** | Memórias, clusters, resumos, montagem de contexto p/ IA |
| 4 | **Relationship Engine** | Amizade, confiança, familiaridade, tempo de convivência |
| 5 | **World Engine** | Mundos, biomas, itens, "mundo espelho", constelações |
| 6 | **AI Engine** | Providers (Mock/Ollama/OpenAI/Anthropic), montagem de prompt |
| 7 | **Habit Engine** | Check-ins, hábitos, missões, streaks, recompensas |
| 8 | **Safety Layer** | Filtro ético em toda entrada/saída da IA |
| 9 | **Sync Engine** | Local / Cloud / Hybrid; resolução de conflito |
| 10 | **Support Network** | Contatos de confiança (opcional) |
| 11 | **Emergency Hub** | Alertas opcionais, consentimento explícito |
| 12 | **Help/Resource Hub** | Recursos de ajuda por país (plugins) |

### Diagrama de dependências entre engines

```
                      ┌──────────────────┐
                      │   Safety Layer    │  (envolve toda I/O da IA)
                      └─────────┬─────────┘
                                │
   ┌──────────┐   ┌─────────────▼────────────┐   ┌───────────────┐
   │  Habit   │──►│        AI Engine          │◄──│    Memory     │
   │  Engine  │   │  (prompt = memory+mood+   │   │    Engine     │
   └────┬─────┘   │   relationship+character) │   └──────┬────────┘
        │         └─────────────┬─────────────┘          │
        │                       │                        │
   ┌────▼──────────┐   ┌────────▼─────────┐   ┌──────────▼────────┐
   │ Tamagotchi    │──►│   Relationship    │──►│  Character Engine │
   │ Engine        │   │   Engine          │   │  (evolução)       │
   └────┬──────────┘   └─────────┬─────────┘   └──────────┬────────┘
        │                        │                        │
        └────────────────────────▼────────────────────────┘
                          ┌──────────────┐
                          │ World Engine  │ (reflete tudo: mundo espelho)
                          └──────────────┘

   Support Network ── Emergency Hub ── Help Hub   (subsistema de apoio, isolado)
```

## 3. Camadas (Clean Architecture)

```
┌─────────────────────────────────────────────────────────┐
│  APRESENTAÇÃO   React (Desktop) / Next.js (Web)          │
│                 Zustand stores, componentes, animações   │
├─────────────────────────────────────────────────────────┤
│  APLICAÇÃO      Use cases / serviços que orquestram      │
│                 engines (ex: "dailyCheckIn", "talkToPet")│
├─────────────────────────────────────────────────────────┤
│  DOMÍNIO        packages/core — engines puras            │
│                 (regras, sem dependência de framework/IO)│
├─────────────────────────────────────────────────────────┤
│  INFRA          Repositórios (SQLite/Postgres), AI       │
│                 providers, sync, file system, Tauri APIs │
└─────────────────────────────────────────────────────────┘
```

**Regra de ouro:** o Domínio (`packages/core`) não importa nada de framework,
banco ou rede. Ele recebe dados e devolve decisões. A Infra implementa as
interfaces que o Domínio define (Dependency Inversion).

## 4. Fluxo: "Usuário conversa com o pet"

```
1. UI captura mensagem do usuário
2. Safety Layer.inspectInput(msg)            → bloqueia/sinaliza riscos
3. Memory Engine.buildContext(userId)        → {mood, friendship, traits, history}
4. Character Engine.getPersona(charId)       → personalidade, frases, tom
5. AI Engine.generate(prompt = context + persona + msg)
       └─ via AIProvider (Mock | Ollama | OpenAI | Anthropic)
6. Safety Layer.inspectOutput(reply)         → remove diagnóstico/culpa/etc.
7. Relationship Engine.applyInteraction(...) → ajusta amizade/confiança
8. Memory Engine.maybeStoreMemory(...)       → cria memória importante
9. World Engine.react(...)                   → vaga-lume novo, clima, etc.
10. UI anima resposta + atualiza mundo
11. Sync Engine (se Cloud/Hybrid) → enfileira mudanças p/ Backend
```

## 5. Contrato do AI Engine

```ts
interface AIProvider {
  id: string;
  isAvailable(): Promise<boolean>;
  generate(req: GenerateRequest): Promise<GenerateResponse>;
  // streaming opcional
  stream?(req: GenerateRequest): AsyncIterable<string>;
}

interface GenerateRequest {
  system: string;          // persona + regras de segurança
  context: PromptContext;  // memory, mood, relationship, traits
  messages: ChatTurn[];    // histórico recente
  temperature?: number;
}
```

Implementações: `MockProvider` (dev/test, sem IA), `LocalOllamaProvider`
(padrão em produção), `OpenAIProvider` e `AnthropicProvider` (preparados, opt-in).

## 6. Estado emocional SEM barras

Os estados da Tamagotchi Engine **nunca** aparecem como `Humor 70%`. São
traduzidos pela World/Character Engine em sinais sensoriais:

| Estado interno | Expressão visual |
|----------------|------------------|
| Energia baixa | Pet boceja, luz mais fraca, ritmo lento |
| Humor alto | Cores quentes, flores brotam, animação saltitante |
| Vínculo crescente | Pet se aproxima da tela, novos objetos no quarto |
| Curiosidade | Pet explora cenário, olha objetos |
| Dia difícil do usuário | Chuva suave, paleta mais fria, pet aconchegante |

## 7. Decisões de Arquitetura (ADRs resumidas)

- **ADR-001 Offline-first / SQLite como verdade local** — privacidade e funcionamento
  sem internet são requisitos de produto, não otimizações.
- **ADR-002 Engines puras em `packages/core`** — reuso entre 3 plataformas e
  testabilidade sem mocks de I/O.
- **ADR-003 IA atrás de `AIProvider`** — trocar de modelo/provider não toca o domínio.
- **ADR-004 Safety Layer obrigatória em toda I/O da IA** — segurança não é opcional.
- **ADR-005 Sync opt-in com CRDT/last-write-wins por entidade** — ver doc de Sync.
- **ADR-006 Help Hub por plugins de país** — `BrazilProvider`, `USProvider`, etc.

Ver detalhes de dados em [03-BANCO-DE-DADOS.md](03-BANCO-DE-DADOS.md).
