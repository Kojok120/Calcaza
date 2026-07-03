# Calcaza Site Context

> 本ファイルは PSEO 共通の generic agent（kw-researcher / fact-checker / seo-aio-auditor / calc-builder）が起動時に読み込む構造化コンテキスト。
> 手で更新可。section heading は他サイトと完全一致させること（パース事故防止）。

## サイト基本情報
- name: Calcaza
- url: https://calcaza.com
- internal_codename: brazcalc（リポジトリ内フォルダ名／import パス用、公開表記には使わない）
- language: pt-BR
- locale: pt_BR
- intl_locale: pt-BR
- currency: BRL
- currency_symbol: R$
- date_format: dd/mm/yyyy（小数点はカンマ、千の位はピリオド：1.234,56）
- title_max_chars: 60（半角換算。ブランド接尾辞「 | Calcaza」込みで判定）
- description_min_chars: 80
- description_max_chars: 160
- tax_year_convention: 暦年（1-12月）。IRPF 確定申告（Declaração de Ajuste Anual）の提出期限は概ね 3-5月（例年 5/31 前後）

**ターゲット明確化**: pt-BR（ブラジル在住のポルトガル語話者）。Portugal（AT＝Autoridade Tributária）や他のルゾフォン諸国（Angola/Moçambique 等）は対象外。地理的混同事故防止のため、ポルトガル（AT）や他国の規制値でブラジル計算機を更新しない。

## 一次ソース TLD whitelist
- gov.br（最優先、ブラジル連邦政府）
- receita.fazenda.gov.br / gov.br/receitafederal（Receita Federal do Brasil — IRPF / IRRF / CPF / CNPJ / Simples Nacional）
- gov.br/inss（INSS — Instituto Nacional do Seguro Social）
- gov.br/previdencia（Previdência Social / tabela de contribuição）
- caixa.gov.br / fgts.gov.br（Caixa Econômica Federal — FGTS）
- gov.br/trabalho-e-emprego（Ministério do Trabalho e Emprego — salário mínimo, CLT）
- tst.jus.br（Tribunal Superior do Trabalho — Justiça do Trabalho, verbas rescisórias）
- planalto.gov.br（Presidência — texto das leis, CLT, decretos do salário mínimo）
- ibge.gov.br（IBGE — INPC / IPCA / estatísticas）
- bcb.gov.br（Banco Central do Brasil — Selic, Calculadora do Cidadão）
- tesouro.gov.br（Tesouro Nacional）
- www8.receita.fazenda.gov.br/SimplesNacional（portal do Simples Nacional / MEI）
- 州税は各州 Secretaria da Fazenda（SEFAZ）の .gov.br（ICMS / IPVA）

## 一次ソース reject list
- .pt（Portugal — Autoridade Tributária 等、地理的ミスマッチ。pt-PT 方言混入の温床）
- .ao / .mz / .cv（Angola / Moçambique / Cabo Verde 等、ルゾフォン他国）
- 個人ブログ / 会計事務所のオウンドメディア（Contabilizei / Jornal Contábil 等は補助情報のみ、一次ソースにしない）
- 銀行・フィンテックのブログ（Nubank / Serasa / Mobills 等、補助のみ）
- 4devs / iCalculator 等の汎用ツール（数値の出典にしない）

## 主要規制当局（YMYL 引用先）
- Receita Federal do Brasil (RFB) — Imposto de Renda（IRPF / IRRF）, CPF/CNPJ, Simples Nacional
- INSS / Previdência Social — contribuição previdenciária, aposentadoria, tabela INSS
- Caixa Econômica Federal — FGTS（depósito 8%, multa rescisória 40%）
- Ministério do Trabalho e Emprego (MTE) — salário mínimo, CLT, normas trabalhistas
- TST / Justiça do Trabalho — verbas rescisórias, aviso prévio, horas extras
- Banco Central do Brasil (BCB) — Selic, índices, Calculadora do Cidadão
- IBGE — INPC / IPCA（correção, inflação）
- Comitê Gestor do Simples Nacional (CGSN) — anexos / faixas do Simples e MEI

## 大手競合（避ける／差別化対象）
- Calculadora do Cidadão (Banco Central) — 公式・限定的UI
- 4devs / iCalculator / Calcule Mais / Calculadora Online — 汎用 calc 大手
- JusBrasil（calculadoras trabalhistas）— 法務ポータル
- Contabilizei / Jornal Contábil / Contábeis — 会計オウンドメディア
- Serasa / Nubank / Mobills（blog）— フィンテック大手メディア
- iDinheiro / FinanceOne — 金融比較

## ロールモデル個人サイト（参考）
- 4devs.com.br（個人運営から成長した汎用ツール群＝execution-fit の実例）

## アフィリエイト網
- Hotmart / Eduzz / Monetizze — info products（ブラジル最大級のデジタル商材ASP）
- Amazon Associados (Brasil) — 物販
- Shopee Affiliate (Brasil) — 物販（SEA/BR 強い）
- Magazine Luiza（Parceiro Magalu）/ Mercado Livre Afiliados — 物販
- Contabilizei / contabilidade online — MEI/PJ 会計（高 CPA）
- Nubank / fintech CPA（cartão / conta） — 金融
- Wise（Partnerize CPA、承認済 2026-07-03、payout JPY、伯は Wise プロモ国） — 国際送金。calc タグ `remittance` / `wise-partnerize`

## AdSense 市場
- 入札市場: Google.com.br（ブラジル）
- 通貨: BRL（CPC は US より低いが検索ボリューム大）

## 更新トリガ（fact-checker が監視）
- Tabela INSS（毎年1月、salário mínimo 改定と連動 → faixas/alíquotas/teto）
- Tabela IRRF / IRPF（不定期。基準値・faixas の改定時。確定申告ルールは毎年2-3月に Receita が公表）
- Salário mínimo federal（毎年1月、decreto で改定）
- Teto do INSS / teto de benefícios（毎年1月）
- FGTS（率は8%固定だが、distribuição de lucros / 規則変更を監視）
- Simples Nacional / MEI 上限・anexos（年次 / 法改正時）
- Selic（COPOM 年8回）— 金利・補正系計算
- INPC / IPCA（毎月、IBGE）— 補正・実質値系計算

## カテゴリ別重点
- tax: Receita Federal の tabela IRRF / IRPF / Simples 追従
- labor: tabela INSS / salário mínimo / CLT（rescisão, 13º, férias, horas extras）追従
- finance: Selic / financiamento / juros 追従
- health: planos de saúde / reajuste ANS（必要時）

## 言語ルール
- ブラジルポルトガル語（pt-BR）必須。**pt-PT（Portugal）方言は禁止**
- 避ける語彙（pt-PT → pt-BR）: telemóvel→celular, ecrã→tela, autocarro→ônibus, comboio→trem, casa de banho→banheiro, factura→fatura, IVA→（ブラジルは ICMS/ISS/IPI）
- 二人称は「você」。pt-PT の「tu + 動詞活用」は避ける
- ブラジル制度名はそのまま使用: INSS, FGTS, IRPF, IRRF, CLT, CPF, CNPJ, MEI, DAS, PIS, 13º salário, FGTS
- 通貨表記: R$（例: R$ 1.234,56）。小数点はカンマ、千の位はピリオド
- 日付: dd/mm/yyyy
- 口調: 丁寧だが親しみやすい（「você」）。スラング不可
- YMYL: 断定避け（「você vai pagar R$ X」ではなく「o valor aproximado é R$ X」）

## 既存実装スキャン先
- ファイル: brazcalc/calculators/registry.ts
- ディレクトリ規約: brazcalc/calculators/<slug>/

## サンプル slug 命名規則
- ポルトガル語タイトル: `calculadora-<topic>`（例: `calculadora-salario-liquido`, `calculadora-rescisao-clt`, `calculadora-decimo-terceiro`, `calculadora-inss`, `calculadora-irrf`, `calculadora-fgts`）
- 制度略称はそのまま使用可: `calculadora-fgts`, `calculadora-inss`, `calculadora-irrf`, `calculadora-mei-das`

## 死に筋 KW（絶対に作らない）
- 単純な「calculadora online」汎用（4devs / iCalculator 支配）
- BMI / idade / data / regra de três 等の汎用 calc（汎用 calc サイト支配）
- 単純な「conversor de moedas」（Google/XE 支配）
- Portugal（AT）/ 他ルゾフォン国の税制（地理的ミスマッチ、対象外）
- specific tax position / アドバイス断定（contador / advogado 領域）
- 「gerador de CPF/CNPJ」等の生成系（4devs 支配＋規約リスク）

## カテゴリ enum と applicationCategory マッピング
- カテゴリ: `pet | finance | tax | labor | life | family | tech | health`
  - pet = 「Moradia e imóveis（住居・不動産）」用途に流用、labor = 「Salário e folha（給与・労務）」
- finance/tax/labor → `FinanceApplication`
- health → `HealthApplication`
- pet/family/life → `LifestyleApplication`
- tech → `UtilitiesApplication`

## YMYL カテゴリ
- finance / tax / health / labor は YMYL 扱い（ブラジルは trabalhista=labor が中核のため labor も含む）
- 一次出典 5+ 必須、断定的助言禁止、運営者表記必須

## 構造化データ規定値
- inLanguage: 'pt-BR'
- priceCurrency: 'BRL'
- isAccessibleForFree: true
- offers.price: '0'
