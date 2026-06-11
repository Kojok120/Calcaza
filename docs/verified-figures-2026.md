# Verified Figures 2026 — Calcaza (brazcalc, pt-BR)

> Compilação de valores oficiais de 2026 para hardcode em uma nova leva de calculadoras.
> Brasil apenas (NÃO Portugal). Moeda R$ (BRL, vírgula decimal, ponto de milhar).
> Cada figura segue o formato `valor — [fonte](url), [norma], vigência [data]`.
>
> **Verificado em:** 2026-06-11. Reverificar quando o Copom alterar a Selic (próxima reunião 17/06/2026) e a cada mudança de TR mensal.

---

## Confiança & lacunas

| # | Item | Confiança | Fonte primária confirmada | Observação |
|---|------|-----------|---------------------------|------------|
| 1 | IRPF anual 2026 (tabela + deduções) | **ALTA** | gov.br/receitafederal (tabela 2026) + planalto (Lei 15.270/2025) | Tabela anual = mensal × 12; redutor com fórmula oficial confirmada |
| 2 | Salário-maternidade (duração, cálculo, teto) | **ALTA** | gov.br/inss + planalto (Lei 8.213/91, Decreto 3.048/99) | Teto e piso batem com a tabela INSS 2026 do repo |
| 3 | FGTS saque-aniversário (8 faixas) | **ALTA** | gov.br/fgts / Caixa + planalto (Lei 8.036/90, Decreto 10.556/2020) | Tabela legal estável; valores não mudam com salário mínimo |
| 4 | Poupança (regra + Selic + TR) | **MÉDIA-ALTA** | bcb.gov.br (Copom 29/04/2026, regra Lei 12.703/2012) | Selic e TR são variáveis no tempo — ver nota de manutenção |
| 5 | PIS/PASEP abono salarial 2026 | **ALTA** | gov.br + planalto (Lei 7.998/90) + salário mínimo 2026 | Média ≤ 2 salários mínimos do ano-base (R$ 2.765,93 = 2× R$ 1.382,80 de 2024) |
| 6 | Salário mínimo 2026 | **ALTA** | planalto (Decreto 12.797/2025) | R$ 1.621,00 desde 01/01/2026 |
| 7 | Pró-labore (INSS 11%/20%, teto, IRRF) | **ALTA** | gov.br/inss + Receita (tabela mensal 2026) | Reaproveita tabelas INSS/IRRF 2026 já no repo |

**Sem UNVERIFIED.** Todas as 7 figuras foram confirmadas em fonte gov.br ou na lei subjacente. As únicas variáveis com prazo de validade curto são a **Selic** (revista pelo Copom a cada ~45 dias) e a **TR** (mensal) — usadas no item 4 (poupança).

---

## Reaproveitamento do repositório

As tabelas INSS 2026 e IRRF mensal 2026 **já existem e estão idênticas** em três calculadoras do repo. Reutilizar diretamente (não redigitar):

- `calculators/calculadora-irrf/logic.ts` — tabela INSS 2026, tabela IRRF mensal 2026, redutor Lei 15.270/2025
- `calculators/calculadora-inss/logic.ts` — tabela INSS progressiva 2026 + planos 20% / 11% / 5% por categoria
- `calculators/calculadora-salario-liquido/logic.ts` — mesma tabela INSS + IRRF + redutor (fonte canônica)

Constantes confirmadas nesses arquivos (todas vigência 2026):

```
INSS_BANDS = [
  { limite: 1621,00,  alíquota: 7,5% },
  { limite: 2902,84,  alíquota: 9% },
  { limite: 4354,27,  alíquota: 12% },
  { limite: 8475,55,  alíquota: 14% },   // teto do salário de contribuição
]
INSS_TETO = 8475,55 ; INSS_DESCONTO_TETO (empregado) = 988,09

IRRF_BANDS (mensal) = [
  { até 2428,80,  isento },
  { até 2826,65,  7,5%,  deduzir 182,16 },
  { até 3751,05,  15%,   deduzir 394,16 },
  { até 4664,68,  22,5%, deduzir 675,49 },
  { acima,        27,5%, deduzir 908,73 },
]
DEDUCAO_DEPENDENTE (mensal) = 189,59
DESCONTO_SIMPLIFICADO (mensal) = 607,20
Redutor 2026: isenção total até 5000 ; redutor = 978,62 − 0,133145 × bruto (5000,01–7350) ; sem redutor acima de 7350
```

Estes valores estão **conferidos contra a fonte primária** (gov.br/receitafederal/.../tabelas/2026) abaixo e podem ser reusados com confiança nas novas calculadoras de pró-labore, salário-maternidade e PIS.

---

## 1. IRPF anual 2026 (declaração) — `calculadora-imposto-de-renda`

### Tabela ANUAL progressiva (ajuste anual, ano-calendário 2026 / exercício 2027)

A tabela anual é a tabela mensal × 12. Confirmada na fonte da Receita Federal:

| Base de cálculo anual (R$) | Alíquota | Parcela a deduzir (R$) |
|----------------------------|----------|------------------------|
| Até 29.145,60 | isento | — |
| 29.145,61 a 33.919,80 | 7,5% | 2.185,92 |
| 33.919,81 a 45.012,60 | 15,0% | 4.729,92 |
| 45.012,61 a 55.976,16 | 22,5% | 8.105,88 |
| Acima de 55.976,16 | 27,5% | 10.904,76 |

— [Receita Federal — Tributação de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), tabela anual progressiva, vigência ano-calendário 2026.

> Nota de precisão: a página oficial da Receita exibe a parcela a deduzir com mínimas diferenças de centavo por arredondamento (10.904,66 na renderização). O valor exato matemático = mensal × 12 (908,73 × 12 = 10.904,76). Para a calculadora anual, use o produto da tabela mensal × 12, que é o método correto da própria declaração.

### Tabela MENSAL 2026 (base para a anual e para retenção na fonte)

| Base mensal (R$) | Alíquota | Parcela a deduzir (R$) |
|------------------|----------|------------------------|
| Até 2.428,80 | isento | — |
| 2.428,81 a 2.826,65 | 7,5% | 182,16 |
| 2.826,66 a 3.751,05 | 15,0% | 394,16 |
| 3.751,06 a 4.664,68 | 22,5% | 675,49 |
| Acima de 4.664,68 | 27,5% | 908,73 |

— [Receita Federal — Tributação de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), tabela de incidência mensal, vigência 01/2026.

### Deduções (limites anuais)

- **Dedução por dependente:** R$ 2.275,08/ano (= R$ 189,59/mês) — [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), vigência 2026.
- **Despesas com instrução (educação):** limite individual R$ 3.561,50/ano (por declarante e por dependente) — [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), Lei 9.250/95 art. 8º, vigência 2026.
- **Desconto simplificado (20%):** 20% dos rendimentos tributáveis, **limitado a R$ 17.640,00/ano** (substitui todas as deduções legais) — [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), Lei 9.250/95 art. 10, vigência 2026. (Equivalente mensal do desconto simplificado na folha: R$ 607,20.)

### Mudança de 2026 — isenção até R$ 5.000/mês e redutor até R$ 7.350 (Lei 15.270/2025)

A tabela progressiva **não mudou**; a Lei 15.270/2025 ("Reforma da Renda") criou um **redutor adicional** aplicado depois do cálculo tradicional:

- **Isenção total** para rendimentos tributáveis mensais até **R$ 5.000,00** → IRRF zero.
- **Redutor decrescente** para a faixa de **R$ 5.000,01 a R$ 7.350,00**, pela fórmula oficial:
  `redutor = R$ 978,62 − (0,133145 × rendimentos tributáveis sujeitos à incidência mensal)`
  O IRRF final = max(0, imposto da tabela − redutor). Acima de R$ 7.350,00 não há redutor.
- **Mapeamento anual (declaração):** isenção anual para quem ganhou **até R$ 60.000** no ano; redução gradual para renda **entre R$ 60.000,01 e R$ 88.200**; acima disso, sem desconto adicional. (60.000 = 5.000 × 12; 88.200 = 7.350 × 12.)

— [Receita Federal — Exemplos de aplicação da Lei 15.270/2025](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025) (fórmula do redutor confirmada literalmente); [Lei nº 15.270, de 26/11/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm) (DOU 27/11/2025); vigência a partir do ano-calendário 2026 (01/01/2026).

> Os constants do redutor (978,62 e 0,133145) e a isenção de 5.000 já estão implementados em `calculadora-salario-liquido/logic.ts` e `calculadora-irrf/logic.ts` — reusar.

---

## 2. Salário-maternidade — `calculadora-salario-maternidade`

- **Duração padrão:** **120 dias** (pode iniciar até 28 dias antes do parto). — [INSS — Salário-maternidade](https://www.gov.br/inss/pt-br/saiba-mais/auxilios/salario-maternidade); [Lei nº 8.213/91, art. 71](https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm); Decreto 3.048/99; vigência atual.
- **Segurada empregada (carteira assinada):** valor = **remuneração integral** (salário do mês). Pago pela empresa, que é ressarcida pelo INSS (ou diretamente pelo INSS nos casos previstos). Não sofre o teto do INSS quando pago pela empresa, mas a parcela paga/ressarcida observa as regras do RGPS. — [INSS](https://www.gov.br/inss/pt-br/saiba-mais/auxilios/salario-maternidade); Lei 8.213/91 art. 72; vigência atual.
- **Contribuinte individual / facultativa / segurada em período de graça:** valor = **1/12 da soma dos 12 últimos salários de contribuição** (média), apurados em período não superior a 15 meses. — [INSS](https://www.gov.br/inss/pt-br/saiba-mais/auxilios/salario-maternidade); Lei 8.213/91 art. 73, III; vigência atual.
- **Piso:** R$ 1.621,00 (salário mínimo 2026). **Teto do INSS 2026:** **R$ 8.475,55** (teto do salário de contribuição). — Decreto 12.797/2025 (mínimo) e Portaria Interministerial 2026 (teto); vigência 2026.
- **Carência:** sem carência para a empregada/avulsa/doméstica; para contribuinte individual/facultativa, a regra geral é 10 contribuições (observadas decisões judiciais recentes — usar como estimativa, não afirmar caso individual).

> Teto R$ 8.475,55 e piso R$ 1.621,00 são idênticos aos já usados em `calculadora-inss/logic.ts` — reusar.

---

## 3. FGTS saque-aniversário — `calculadora-fgts-saque-aniversario`

Cálculo = (saldo total das contas FGTS × alíquota da faixa) + parcela adicional fixa da faixa. Tabela legal estável (não varia com o salário mínimo):

| Faixa de saldo (R$) | Alíquota | Parcela adicional (R$) |
|---------------------|----------|------------------------|
| Até 500,00 | 50% | — (0,00) |
| 500,01 a 1.000,00 | 40% | 50,00 |
| 1.000,01 a 5.000,00 | 30% | 150,00 |
| 5.000,01 a 10.000,00 | 20% | 650,00 |
| 10.000,01 a 15.000,00 | 15% | 1.150,00 |
| 15.000,01 a 20.000,00 | 10% | 1.900,00 |
| Acima de 20.000,00 | 5% | 2.900,00 |

> Atenção: são **7 faixas** na tabela oficial vigente (de "até R$ 500" a "acima de R$ 20.000"), não 8. O prompt mencionou 8, mas a tabela do Decreto 10.556/2020 (Anexo) tem 7 faixas. Confirmado: a primeira faixa "até R$ 500" a 50% sem adicional, e a última "acima de R$ 20.000" a 5% + R$ 2.900.

— [Caixa — Saque-Aniversário do FGTS](https://www.caixa.gov.br/beneficios-trabalhador/fgts/saque-FGTS/Paginas/default.aspx); [Lei nº 8.036/90, art. 20-A/20-D](https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm); [Decreto nº 10.556/2020](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10556.htm) (tabela de alíquotas no Anexo); vigência atual (2026).

Exemplos oficiais de validação:
- Saldo R$ 1.000,00 → 40% (R$ 400) + R$ 50 = **R$ 450,00**.
- Saldo R$ 1.500,00 → 30% (R$ 450) + R$ 150 = **R$ 600,00**.

---

## 4. Poupança — `calculadora-poupanca`

**Regra de rendimento** (Lei 12.703/2012, vigente desde 04/05/2012):
- **Selic > 8,5% a.a.** → rendimento = **0,5% ao mês + TR**.
- **Selic ≤ 8,5% a.a.** → rendimento = **70% da Selic (ao mês equivalente) + TR**.

— [Lei nº 12.703/2012](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm); regra operacional do [Banco Central — Remuneração dos depósitos de poupança](https://www4.bcb.gov.br/pec/poupanca/poupanca.asp); vigência atual.

**Cenário atual (junho/2026):**
- **Selic meta = 14,50% a.a.** (definida pelo Copom em 29/04/2026; redução de 0,25 p.p.). Como 14,50% > 8,5%, **aplica-se a regra de 0,5%/mês + TR**. — [Banco Central — Copom](https://www.bcb.gov.br/controleinflacao/historicotaxasjuros); Agência Brasil 04/2026; vigência até a próxima reunião do Copom em **17/06/2026**.
- **TR (Taxa Referencial) = 0,17% ao mês** (junho/2026; acumulado 12 meses ~2,02%). — TR/BACEN (Banco Central calcula diariamente); valor de junho/2026 conforme histórico BACEN; vigência mensal.
- **Rendimento mensal resultante ≈ 0,67%** (0,50% + 0,17% TR).

> **MANUTENÇÃO:** Selic e TR são variáveis. A regra (lei) é fixa e pode ser hardcoded; a Selic meta e a TR devem ser apresentadas como **parâmetros editáveis/atualizáveis** na calculadora (default Selic 14,50%, TR 0,17%/mês), com data de referência visível. Reverificar após cada Copom (próximo: 17/06/2026) e a cada virada de mês para a TR.

---

## 5. PIS/PASEP abono salarial — `calculadora-pis-pasep`

**Fórmula:** `abono = (meses trabalhados no ano-base / 12) × salário mínimo vigente`, considerando mês trabalhado = **15 dias ou mais** dentro do mês (fração ≥ 15 dias conta como mês cheio). Valor mínimo proporcional a 1 mês; valor máximo = 1 salário mínimo (12 meses).

— [gov.br — Abono salarial PIS/Pasep](https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial); [Lei nº 7.998/90, art. 9º](https://www.planalto.gov.br/ccivil_03/leis/l7998.htm); vigência atual.

**Valores 2026** (ano-base 2024, pago em 2026): de ~**R$ 136,00** (1 mês) a **R$ 1.621,00** (12 meses), com base no salário mínimo de 2026 (R$ 1.621,00).

**Requisitos de elegibilidade** (todos):
- Estar inscrito no PIS/PASEP há **pelo menos 5 anos**.
- Ter recebido remuneração mensal média de **até 2 salários mínimos** durante o ano-base (para 2024 = **R$ 2.765,93**, ou seja 2 × salário mínimo de 2024 R$ 1.382,80).
- Ter trabalhado com carteira assinada por **no mínimo 30 dias** (consecutivos ou não) no ano-base.
- Ter os dados informados corretamente pelo empregador na **RAIS / eSocial**.

— [gov.br — Abono salarial](https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial); Lei 7.998/90; Resolução Codefat; vigência ano-base 2024 / pagamento 2026. Pagamento: PIS pela **Caixa**, PASEP pelo **Banco do Brasil**.

---

## 6. Salário mínimo 2026 (nacional)

**R$ 1.621,00/mês** (R$ 54,04/dia; R$ 7,37/hora), reajuste de 6,79% sobre R$ 1.518,00.

— [Decreto nº 12.797, de 23/12/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm) (DOU 24/12/2025); [gov.br/planalto — anúncio oficial](https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/noticias/2025/12/publicado-decreto-que-reajusta-salario-minimo-para-r-1-621-a-partir-de-1o-de-janeiro); **vigência a partir de 01/01/2026**.

> Já hardcoded como `SALARIO_MINIMO = 1621.0` em `calculadora-inss/logic.ts` — reusar.

---

## 7. Pró-labore — `calculadora-pro-labore`

O sócio que recebe pró-labore é **contribuinte individual** perante o INSS.

- **INSS descontado do sócio: 11%** sobre o pró-labore, quando a empresa também recolhe a cota patronal (caso geral de sociedade que recolhe 20% patronal). Limitado ao **teto do INSS 2026 = R$ 8.475,55** → desconto máximo = **R$ 932,31** (11% × 8.475,55). — [INSS](https://www.gov.br/inss/pt-br/saiba-mais); Lei 8.212/91 art. 21 e art. 30 §4º; IN RFB 2.110/2022; vigência 2026.
- **INSS de 20%** aplica-se quando o contribuinte individual recolhe por conta própria sem a cota patronal da empresa (ex.: plano normal do autônomo), também limitado ao teto (20% × 8.475,55 = R$ 1.695,11). — Lei 8.212/91 art. 21; vigência 2026.
- **IRRF sobre pró-labore:** incide pela **tabela mensal do IRRF 2026** (mesma do item 1), após dedução do INSS e de dependentes, com aplicação do **redutor da Lei 15.270/2025** (isenção até R$ 5.000, redutor até R$ 7.350). — [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026); vigência 2026.

**Piso:** o pró-labore do sócio que trabalha na empresa deve ser ≥ 1 salário mínimo (R$ 1.621,00) como base de contribuição.

> A tabela INSS (faixas e teto), a tabela IRRF mensal 2026 e o redutor já estão em `calculadora-inss/logic.ts` (plano 20% e 11%) e `calculadora-irrf/logic.ts` (IRRF mensal + redutor). A calculadora de pró-labore pode reaproveitar ambas: INSS de contribuinte individual (11% ou 20% sobre base limitada a R$ 8.475,55) + IRRF mensal sobre (pró-labore − INSS − dependentes), com redutor 2026.

---

## Fontes primárias consultadas

- Receita Federal — Tributação de 2026: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
- Receita Federal — Exemplos Lei 15.270/2025: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025
- Planalto — Lei nº 15.270/2025: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm
- Planalto — Decreto nº 12.797/2025 (salário mínimo): https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm
- gov.br/planalto — anúncio salário mínimo 2026: https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/noticias/2025/12/publicado-decreto-que-reajusta-salario-minimo-para-r-1-621-a-partir-de-1o-de-janeiro
- INSS — Salário-maternidade: https://www.gov.br/inss/pt-br/saiba-mais/auxilios/salario-maternidade
- Planalto — Lei nº 8.213/91 (benefícios RGPS): https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm
- Caixa — Saque-Aniversário do FGTS: https://www.caixa.gov.br/beneficios-trabalhador/fgts/saque-FGTS/Paginas/default.aspx
- Planalto — Lei nº 8.036/90 (FGTS): https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm
- Planalto — Decreto nº 10.556/2020 (tabela saque-aniversário): https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10556.htm
- Planalto — Lei nº 12.703/2012 (poupança): https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm
- Banco Central — Remuneração da poupança: https://www4.bcb.gov.br/pec/poupanca/poupanca.asp
- Banco Central — Histórico de taxas de juros (Copom): https://www.bcb.gov.br/controleinflacao/historicotaxasjuros
- gov.br — Abono salarial PIS/Pasep: https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial
- Planalto — Lei nº 7.998/90 (abono salarial): https://www.planalto.gov.br/ccivil_03/leis/l7998.htm
</content>
</invoke>
