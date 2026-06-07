# Calcaza Calculator Roadmap

> kw-researcher の `next` モードがこのファイルを読んで、次に作るべき1本を選定する。
> 採用したら Implemented セクションに移す。既存実装は `brazcalc/calculators/registry.ts` を信頼源とし、本ファイルは「採用済み・候補・棄却」の意思決定ログ。
> 一次ソース TLD は `docs/site-context.md` の `## 一次ソース TLD whitelist` 準拠（gov.br のみ）。

> **2026-06-05 初版**: Calcaza（pt-BR / Brazil）立ち上げ。seed として salário líquido を実装。以下の Tier 1 候補は SERP 実走前の「種リスト」であり、kw-researcher が実調査して Go/Conditional/Drop を判定すること（特に汎用 calc 大手 4devs / iCalculator / 法務ポータル JusBrasil の占有度を確認）。

## Implemented

- [x] calculadora-salario-liquido — Salário Líquido 2026（INSS + IRRF + redutor Lei 15.270/2025）(2026-06-05)
- [x] calculadora-rescisao — Rescisão CLT 2026（verbas + descontos por tipo）
- [x] calculadora-decimo-terceiro — 13º Salário 2026（1ª/2ª parcela, tributação exclusiva）
- [x] calculadora-ferias — Férias 2026（+1/3, abono pecuniário）
- [x] calculadora-horas-extras — Horas Extras 2026（50%/100% + DSR）
- [x] calculadora-aviso-previo — Aviso Prévio 2026（Lei 12.506/2011, 30+3/ano, teto 90）
- [x] calculadora-fgts — FGTS 2026（8% + projeção + multa 40%/20%）
- [x] calculadora-seguro-desemprego — Seguro-Desemprego 2026（faixas + nº parcelas）
- [x] calculadora-inss — INSS 2026（empregado/autônomo/facultativo/MEI）
- [x] calculadora-irrf — IRRF 2026（base completo x simplificado + redutor）
- [x] calculadora-mei-das — DAS MEI 2026（comércio/serviço/ambos + caminhoneiro）

**実装済み合計: 11本 / 目標 30本**（2026-06-08 にバッチ10本追加。全て gov.br 一次ソース・pt-BR・194 tests / build 37ページ OK・日付分散済）

## Tier 1 候補（SERP 実走前の種リスト — kw-researcher が再評価）

> 評価軸: ボリューム / 競合密度（4devs・iCalculator・JusBrasil の占有）/ 検索意図明確度 / 収益経路 / KD = 各 0-3 点 = 15 点満点。
> ブラジルの中核は trabalhista（労務）と imposto（税）。汎用 calc 大手が「出典なし」で出している領域を、出典付き UI で差別化する。

### Phase 1: 労務（trabalhista）コア — 検索ボリューム最大、CLT の柱

| # | slug 候補 | 主KW（pt-BR） | 連邦/州 | 主要一次ソース |
|---|---|---|---|---|
| 1 | ~~calculadora-salario-liquido~~（実装済） | calculadora salário líquido | Federal | gov.br/inss, Receita 2026, Lei 15.270/2025 |
| 2 | calculadora-rescisao | calculadora rescisão | Federal | CLT (planalto), TST, gov.br/trabalho-e-emprego |
| 3 | calculadora-decimo-terceiro | calculadora 13º salário | Federal | CLT, gov.br/trabalho-e-emprego |
| 4 | calculadora-ferias | calculadora férias (1/3 constitucional) | Federal | CLT, gov.br/trabalho-e-emprego |
| 5 | calculadora-horas-extras | calculadora horas extras | Federal | CLT, convenções, TST |
| 6 | calculadora-seguro-desemprego | calculadora seguro-desemprego | Federal | gov.br/trabalho-e-emprego (parcelas/valores) |
| 7 | calculadora-aviso-previo | calculadora aviso prévio (dias proporcionais) | Federal | Lei 12.506/2011, CLT |

### Phase 2: 税・INSS・FGTS

| # | slug 候補 | 主KW（pt-BR） | 連邦/州 | 主要一次ソース |
|---|---|---|---|---|
| 8 | calculadora-inss | calculadora INSS (desconto/contribuição) | Federal | gov.br/inss, Portaria 2026 |
| 9 | calculadora-irrf | calculadora IRRF (imposto de renda na fonte) | Federal | Receita Federal 2026 |
| 10 | calculadora-fgts | calculadora FGTS (saldo/multa 40%) | Federal | caixa.gov.br/fgts |
| 11 | calculadora-imposto-de-renda | calculadora imposto de renda (anual/restituição) | Federal | Receita Federal (DIRPF) |
| 12 | calculadora-mei-das | calculadora MEI DAS | Federal | Simples Nacional (Receita), CGSN |
| 13 | calculadora-simples-nacional | calculadora Simples Nacional (anexos/alíquota efetiva) | Federal | Simples Nacional (Receita), CGSN |

### Phase 3: 金融・日常（finance / life）

| # | slug 候補 | 主KW（pt-BR） | 連邦/州 | 主要一次ソース |
|---|---|---|---|---|
| 14 | calculadora-financiamento-imovel | calculadora financiamento imobiliário (SAC/Price) | Federal | bcb.gov.br, caixa.gov.br |
| 15 | calculadora-juros-compostos | calculadora juros compostos | — | bcb.gov.br (Calculadora do Cidadão, 参考) |
| 16 | calculadora-parcelamento | calculadora parcelamento / juros do cartão | — | bcb.gov.br |

> 上記は方向性のみ。各本は kw-researcher が SERP 実走 → meta.ts 雛形生成 → calc-builder 実装 → fact-checker 検証 → seo-aio-auditor 監査の順で進める。
> **死に筋**（site-context.md 準拠）: gerador de CPF/CNPJ、汎用 conversor、BMI/idade、Portugal（AT）系は作らない。
