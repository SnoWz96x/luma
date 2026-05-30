# LUMA — Features & Análise de Lacunas

Mapa do que o briefing cobre, o que falta implementar e **features extras** que
elevam o produto. Prioridade: 🔴 MVP · 🟡 pós-MVP próximo · 🟢 V2/futuro.

## Status das engines do briefing

| Engine / Sistema | Doc | Código | Status |
|------------------|-----|--------|--------|
| Arquitetura, Roadmap, DB | ✅ | — | pronto |
| Tamagotchi Engine | ✅ | ✅ + testes | **pronto** |
| Tipos & contratos (shared) | ✅ | ✅ | **pronto** |
| Character Engine | ✅ | 🔧 em andamento | gerando 100 |
| Memory Engine | ✅ | ⬜ | a fazer |
| Relationship Engine | ✅ | ⬜ | a fazer |
| World Engine (mundo espelho) | ✅ | ⬜ | a fazer |
| AI Engine (providers) | ✅ | ⬜ | a fazer |
| Habit Engine | ✅ | ⬜ | a fazer |
| Safety Layer | ✅ | ⬜ | a fazer |
| Sync Engine | ✅ | ⬜ | a fazer |
| Support Network / Emergency / Help Hub | ✅ | ⬜ | a fazer |
| Desktop App (Tauri) | ✅ | ⬜ | a fazer |
| Web Platform / Backend API | ✅ | ⬜ | a fazer |

## Lacunas do briefing (estavam implícitas, agora explícitas)

Coisas citadas na visão mas sem engine própria — vou tratar como features:

- 🔴 **Onboarding / ritual de adoção** — escolher o pet, dar nome, "primeiro
  encontro" (momento mágico tipo chocar um ovo). Sem isso o produto não "começa".
- 🔴 **Diário digital** — citado na visão ("Diário Digital", "Memória Viva") mas
  sem tabela/engine. Proposta: reaproveitar `memories` (source='manual') + uma
  view de diário. Entra no Memory Engine.
- 🔴 **Sistema de notificações/nudges** — lembretes gentis de hábito e check-in
  (inspirado nos ambient nudges do openpets), **sem culpa**, opt-in, via SO.
- 🟡 **Streak com recuperação gentil** — quebrar um streak não pune; oferece
  "retomar" sem drama (reforço da Safety Layer).
- 🟡 **Ciclo dia/noite real** — o mundo reflete a hora real (manhã/tarde/noite);
  o pet dorme à noite. Liga World Engine ao relógio.

## Features extras recomendadas (deixam o LUMA "top")

### Experiência & vínculo
- 🟡 **Sonhos do pet** — durante sua ausência, o pet "vive" pequenos eventos e
  cria mini-memórias para te contar ao voltar (saudade boa, nunca culpa).
- 🟡 **Modo foco / companhia silenciosa** — pet quietinho te acompanha enquanto
  você trabalha; opcional Pomodoro suave (inspiração lil-agents/openpets).
- 🟡 **Time-lapse da jornada** — revisitar o mundo espelho/constelações ao longo
  do tempo ("como eu estava há 3 meses").
- 🟢 **Eventos sazonais** — clima/itens ligados ao calendário real (estações, datas).
- 🟢 **Família do pet** (já no roadmap V2) — amigos/moradores tipo Animal Crossing.

### Bem-estar (sempre não-clínico)
- 🔴 **Micro-exercícios de autocuidado** — respiração guiada, alongar, beber água,
  abrir a janela. Curtos, opcionais, ligados a hábitos.
- 🟡 **Soundscapes cozy** — trilhas ambientes desbloqueáveis (itens type='sound').

### Acessibilidade & inclusão (requisito de qualidade)
- 🔴 **Reduced motion** — respeitar `prefers-reduced-motion` (animações suaves).
- 🔴 **i18n** — pt-BR e en desde o início (strings externalizadas).
- 🟡 **Paletas para daltonismo** + alto contraste; suporte a leitor de tela.
- 🟡 **TTS opcional** — o pet pode "falar" (voz suave), desligável.

### Privacidade & confiança (diferencial do produto)
- 🔴 **Export/Import/Apagar dados** (já no briefing) — UI clara + dump JSON/SQLite.
- 🟡 **Criptografia local** opt-in (SQLCipher) para o banco.
- 🟡 **Painel de transparência** — "o que o LUMA sabe sobre mim", tudo editável.

### Plataforma & qualidade técnica
- 🟡 **Telemetria local-only opt-in** — métricas anônimas no próprio dispositivo.
- 🟡 **Sistema de plugins** — Help Hub por país já é plugin; estender p/ packs de
  personagens, biomas, soundscapes (galeria comunitária do openpets).
- 🟢 **Mobile** (roadmap) — mesmo `packages/core` reutilizado.

## Decisões de priorização
- O MVP (Fase 1-3) **não** muda: Desktop Pet → Memória/IA → Relação/Hábitos.
- As lacunas 🔴 acima entram no MVP por serem essenciais à experiência
  (onboarding, diário, nudges, acessibilidade, privacidade).
- Extras 🟡/🟢 viram backlog priorizado pós-MVP.
