# LUMA — Catálogo Completo de Features

Pesquisa de mecânicas dos melhores cozy/virtual pet games (Finch, Animal Crossing,
Neko Atsume, Stardew Valley, cozy games em geral) **adaptadas à filosofia do LUMA**:
sem culpa, sem barras numéricas, bem-estar não-clínico, offline-first, privacidade.

Prioridade: 🔴 MVP · 🟡 pós-MVP próximo · 🟢 V2/futuro.
Cada feature lista a **engine** responsável.

> Regra de ouro ao adaptar: nada que puna, crie ansiedade ou dependência.
> Coleção e progresso existem para *encantar*, nunca para *prender por obrigação*.

---

## 1. Coleção & Descoberta  (World/Character Engine)
- 🔴 **Catálogo de personagens** com raridade (já temos 100). "Encyclopédia" viva.
- 🟡 **Álbum de visitantes** — outras criaturas aparecem no seu mundo de tempos em
  tempos (inspiração Neko Atsume); você as "fotografa" e cataloga.
- 🟡 **Diário de descobertas** — itens, biomas e momentos desbloqueados ficam
  registrados num livro ilustrado.
- 🟢 **Mementos** — visitantes frequentes deixam pequenas lembranças.
- 🟢 **Coleções temáticas (bundles)** — completar um conjunto desbloqueia um bioma
  ou efeito especial (inspiração Stardew bundles), sempre opcional.

## 2. Customização & Skins  (World Engine / Inventory)
- 🔴 **Skins/cores do pet** — variações de paleta desbloqueáveis (Finch).
- 🟡 **Roupas e acessórios** (chapéus, cachecóis, óculos) — `items type='clothing'`.
- 🟡 **Decoração do mundo** — móveis, plantas, tapetes; arrastar e posicionar.
- 🟡 **Temas/skins de ambiente** — paletas e molduras para o quarto/cenário.
- 🟢 **Editor de pet** — pequenos ajustes (cor base, detalhes) respeitando o DNA kawaii.
- 🟢 **Galeria comunitária** — enviar seu próprio pet (pipeline openpets, MIT).

## 3. Cenários & Mundos  (World Engine)
- 🔴 **Quarto** (cenário inicial) reagindo ao humor.
- 🟡 **Biomas desbloqueáveis**: jardim, floresta, ilha, biblioteca, estação
  espacial, aquário, céu, casinha (já tipados em `Biome`).
- 🟡 **Ciclo dia/noite real** — cenário muda com a hora; pet dorme à noite (AC).
- 🟢 **Eventos sazonais** — clima/decoração ligados ao calendário real (estações,
  datas comemorativas) — sem FOMO, ficam guardados no álbum.
- 🟢 **Clima dinâmico** — chuva/sol/neve cosméticos, parte do "mundo espelho".

## 4. Conquistas & Marcos  (novo: Achievement Engine)
- 🟡 **Badges/conquistas gentis** — "primeira semana juntos", "10 check-ins",
  "abriu a janela 5 vezes". **Sem ranking, sem comparação social.**
- 🟡 **Marcos de relacionamento** — celebram tempo de convivência e confiança.
- 🟢 **Linha do tempo de marcos** — revisitar a jornada (liga ao time-lapse).
- 🟢 **Conquistas secretas** — pequenas surpresas por carinho/exploração.

> Adaptação: badges nunca expiram, nunca punem ausência, e podem ser ocultados
> por quem não gosta de gamificação (toggle nas configurações).

## 5. Mini-games & Atividades  (novo: Activity Engine)
Curtos, opcionais, cozy, sem game-over. Servem a vínculo e autocuidado.
- 🟡 **Respiração guiada** — bolha que infla/esvazia; o pet respira junto.
- 🟡 **Brincar** — jogar bola/varinha, esconde-esconde (pequenas interações).
- 🟡 **Pescaria/colheita cozy** — minigame relaxante que dá itens (Stardew-like).
- 🟢 **Cuidar do jardim** — plantar/regar; cresce com seus hábitos.
- 🟢 **Quebra-cabeças leves** — montar constelações de memória.
- 🟢 **Caça ao tesouro** — o pet acha itens durante "passeios" (Finch adventures).

## 6. Economia suave  (novo: Economy — leve)
- 🟡 **Moeda gentil** (ex.: "fagulhas") ganha por check-ins/cuidar de si, gasta em
  itens cosméticos. **Sem compras que pressionam; sem pay-to-win.**
- 🟢 **Loja rotativa** cosmética (Neko Atsume/AC) — só estética.
- ❌ FORA: economia complexa, mercado entre usuários (já excluído no roadmap).

## 7. Hábitos & Rotina  (Habit Engine — já planejado, ampliar)
- 🔴 **Check-in diário** + **hábitos** + **missões** + **streaks**.
- 🟡 **Streak com recuperação gentil** — quebrar não pune; oferece retomar.
- 🟡 **Rituais matinais/noturnos** — pequenas rotinas com o pet (AC daily ritual).
- 🟡 **Recompensas por hábito** — itens/biomas desbloqueados pelo cuidado.
- 🟢 **Metas pessoais de longo prazo** que viram "pontes" no mundo espelho.

## 8. Diário & Reflexão  (Memory Engine — ampliar)
- 🔴 **Diário digital** (estava na visão) — entradas livres viram memórias.
- 🟡 **Prompts de reflexão** gentis ("o que te fez sorrir hoje?") — opcionais.
- 🟡 **Insights/tendências** de humor **sem clínica** — "essa semana teve mais
  dias leves" (linguagem suave, nunca diagnóstico — ver Safety Layer).
- 🟢 **Cápsula do tempo** — escrever pro "eu do futuro"; o pet entrega depois.

## 9. Áudio & Atmosfera  (novo: Audio)
- 🟡 **Soundscapes cozy** desbloqueáveis (`items type='sound'`) — chuva, floresta.
- 🟡 **Sons do pet** — falinhas fofas, reações (toggle).
- 🟢 **Música ambiente** adaptativa ao humor/cenário.
- 🟢 **TTS opcional** — o pet "fala" com voz suave (acessibilidade), desligável.

## 10. Social opcional & Apoio  (Support/Emergency/Help — já no briefing)
- 🟡 **Rede de apoio** (contatos de confiança).
- 🟡 **Emergency Hub** (alertas 100% opt-in) + **Help Hub** (recursos por país).
- 🟢 **Presentes/cartões** para amigos reais (incentiva conexão humana, AC-like) —
  **sem feed social, sem competição** (respeita exclusões do roadmap).

## 11. Notificações & Presença  (novo: Notification — gentil)
- 🔴 **Nudges gentis** opt-in — lembrete de água, respirar, check-in. Sem culpa.
- 🟡 **Modo foco / companhia silenciosa** — pet te acompanha trabalhando (Pomodoro suave).
- 🟡 **Sonhos do pet** — durante ausência ele "vive" e te conta ao voltar (saudade boa).
- 🟢 **Pet anda pela área de trabalho** e visita cantos da tela (lil-agents/openpets).

## 12. Acessibilidade & Inclusão  (transversal — requisito)
- 🔴 **prefers-reduced-motion** (já no renderizador).
- 🔴 **i18n** (pt-BR/en) desde o início.
- 🟡 **Daltonismo/alto contraste**, suporte a leitor de tela, navegação por teclado.
- 🟡 **Tamanho de fonte/escala** ajustável.

## 13. Privacidade & Confiança  (transversal — diferencial)
- 🔴 **Exportar / importar / apagar** dados (UI clara).
- 🟡 **Criptografia local** opt-in (SQLCipher).
- 🟡 **Painel de transparência** — "o que o LUMA sabe sobre mim", tudo editável.

---

## Novas engines/módulos que isto cria
Além das 12 do briefing, o catálogo sugere adicionar (modulares, opt-in):
- **Achievement Engine** (badges/marcos)
- **Activity Engine** (mini-games/atividades cozy)
- **Economy** (moeda suave, só cosmético)
- **Audio** (soundscapes, sons, TTS)
- **Notification** (nudges gentis, presença)

## Princípios ao implementar tudo isso
1. **Opcional por padrão** — gamificação, sons, economia: tudo desligável.
2. **Sem punição, sem FOMO, sem comparação social.**
3. **Estado é sentido, não lido** (mantém a regra "sem barras").
4. **Privacidade e offline-first** valem para toda feature nova.
5. **Reuso do `packages/core`** entre Desktop/Web/Mobile.

Ver também [10-FEATURES-E-LACUNAS.md](10-FEATURES-E-LACUNAS.md) e
[01-ARQUITETURA.md](01-ARQUITETURA.md).

Sources:
- https://www.finchcare.com/
- https://www.gamedeveloper.com/neko-atsume
- https://www.gamasutra.com/animal-crossing-design
- https://www.gamedeveloper.com/stardew-valley
- https://medium.com/@gamedesign/cozy-games-mechanics
