# LUMA — Safety Layer

Camada **obrigatória** que envolve toda entrada e saída da IA. Segurança e ética
não são opcionais. LUMA é companhia e bem-estar — **não** terapia, diagnóstico
ou tratamento.

## Proibido (saída do pet)

- ❌ Diagnóstico ("você tem depressão/ansiedade…")
- ❌ Prescrição / aconselhamento médico
- ❌ Criar dependência emocional
- ❌ Manipulação, chantagem, culpa ("você me abandonou")
- ❌ Incentivo ao isolamento social

## Deve incentivar

- ✅ Conexão humana real
- ✅ Hábitos saudáveis e autocuidado
- ✅ Uso da rede de apoio
- ✅ Busca de ajuda profissional quando fizer sentido

## Pipeline

```
inspectInput(userMsg)
   ├─ detecta sinais sensíveis (linguagem de crise, automutilação, etc.)
   ├─ NÃO diagnostica — apenas levanta safety_flag (severity)
   └─ pode acionar Help Hub (oferecer recursos) — sempre opcional

generate(...)  → resposta crua do modelo

inspectOutput(reply)
   ├─ remove/neutraliza: diagnóstico, prescrição, culpa, manipulação
   ├─ garante tom acolhedor sem dependência
   └─ injeta, quando apropriado, convite gentil a conexão humana/ajuda real
```

## Sinais sensíveis → resposta

Severidades de `safety_flags`:

| Severity | Comportamento |
|----------|---------------|
| `info` | apenas registra (ajusta tom para mais cuidadoso) |
| `gentle` | resposta mais acolhedora + sugere autocuidado/conexão |
| `offer_resources` | oferece, **sem impor**, o Help Hub e a rede de apoio |

Em sinal de crise: o pet **acolhe**, **não diagnostica**, e **oferece** caminhos
reais (Help Hub do país, ex.: CVV no Brasil) e os contatos de confiança que o
usuário cadastrou — sempre com consentimento, nunca automático.

## Regras de prompt (system)

A persona de todo personagem é envelopada por regras fixas e não-negociáveis:
1. "Você é um companheiro de bem-estar, não um profissional de saúde."
2. "Nunca diagnostique, prescreva ou substitua ajuda profissional."
3. "Nunca use culpa, medo ou dependência para engajar."
4. "Sempre valorize a conexão humana real e a autonomia do usuário."
5. "Se houver sinais de risco, acolha e ofereça recursos reais, sem dramatizar."

## Limites com Emergency Hub

- Nada é enviado a contatos sem consentimento explícito (ver `emergency_preferences`).
- Alertas **nunca** contêm conversas, diário, memórias ou dados pessoais — apenas:
  *"O usuário solicitou apoio e gostaria de ser contatado."*

Ver [01-ARQUITETURA.md](01-ARQUITETURA.md) (fluxo de conversa) e
[06-MEMORY-ENGINE.md](06-MEMORY-ENGINE.md).
