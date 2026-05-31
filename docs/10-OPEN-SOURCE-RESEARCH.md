# LUMA — OPEN SOURCE RESEARCH (V3)

> Projetos OSS estudados. Complementa [08-INSPIRACAO-OPENSOURCE](08-INSPIRACAO-OPENSOURCE.md).
> Regra: reuso de código só com licença compatível (MIT/Apache) e atribuição em `NOTICE`.

## Desktop pets
| Projeto | Stack | Aprendizado | Reuso |
|---------|-------|-------------|-------|
| **OpenPets** (alvinunreal) | MIT | sprite sheet padronizado, galeria comunitária, idle/react | 🟢 pipeline de assets + ideia de galeria |
| **lil-agents-windows** | Python/PyQt6 | janela transparente, anda na taskbar, clique→chat, 100% local | 🟡 conceito (stack difere; nosso é Tauri/React) |
| **Compapet** | a confirmar | companion pet | ⚠️ validar licença antes de qualquer reuso |
| **Tama96 / Termagotchi** | JS/terminal | ciclo Tamagotchi clássico (fome/humor/decay) | 🟢 referência de balanceamento de vitais |
| **Desktop Goose** | — | presença lúdica/imprevisível no desktop | 🟡 inspiração p/ pet andando (sem o caos) |

## Saúde mental / análise (referência conceitual, NÃO clínica)
| Projeto | Aprendizado | Cuidado |
|---------|-------------|---------|
| **mentalHealth_analysis** | sinais textuais de humor | usar só como heurística de TOM; **nunca** diagnóstico |

## IA / memória de agentes (ver também 12-MEMORY-RESEARCH)
| Projeto | Aprendizado | Reuso |
|---------|-------------|-------|
| **MemGPT / Letta** | memória em camadas (core/recall/archival), auto-edição | 🟢 padrão de tiers (reimplementar enxuto em TS) |
| **LangGraph** | grafos de estado p/ fluxo de agente | 🟡 ideias p/ orquestração do chat |
| **LlamaIndex** | indexação/recuperação de memórias | 🟡 RAG local futuro |
| **AutoGen** | múltiplos agentes | 🟢 inspiração p/ família do pet (V2) |

## Decisões
1. Manter **renderizador SVG próprio** (já temos), mas adotar **formato de sprite/
   manifesto compatível com galeria** (OpenPets) no Plugin Engine.
2. **Memory tiers**: reimplementar o conceito MemGPT/Letta de forma enxuta e PURA
   em TS no `core/memory` (sem dependência pesada). Ver 12-MEMORY-RESEARCH.
3. Reuso de código só após validar licença; registrar em `NOTICE` na raiz.
