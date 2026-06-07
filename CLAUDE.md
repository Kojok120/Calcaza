# CLAUDE.md

> このファイルは、Claude Code を含む AI アシスタントが本リポジトリで作業する際の規約。
> プロジェクト概要は [README.md](./README.md)、ランタイム構造化コンテキストは [docs/site-context.md](./docs/site-context.md) を参照。

## Project: brazcalc（公開ブランド: Calcaza）

ドメイン: `calcaza.com`
言語: ブラジルポルトガル語（pt-BR）／対象市場: ブラジル在住者（労働者・MEI・自営業・確定申告者）

`keisanya`（日本語）／`alhasiba`（アラビア語）／`matecalc`（AU 英語）／`sacalculo`/Contazon（es-US）と同じ scaffold をフォーク。**JP / AR / AU / US の計算機は持ち込まない**。ブラジル制度（Receita Federal、INSS、FGTS/Caixa、CLT/Ministério do Trabalho、TST、Banco Central）× ポルトガル語の組み合わせで**新規構築**する。

**地理的明確化**: Portugal（Autoridade Tributária）や他のルゾフォン諸国（Angola / Moçambique / Cabo Verde 等）は対象外。AT 由来の数値や pt-PT 方言でブラジル計算機を更新しない。`telemóvel`/`ecrã`/`factura`/`IVA` 不可、`celular`/`tela`/`fatura` を使用、二人称は `você`、通貨は `R$`、機関名はブラジルの正式名で統一。

## Mission

ブラジルの労働者・自営業者・MEI が検索する "calculadora salário líquido"、"calculadora rescisão"、"calculadora INSS"、"calculadora IRRF"、"calculadora FGTS"、"calculadora 13º salário"、"calculadora décimo terceiro"、"calculadora férias"、"calculadora MEI DAS" 等のロングテールを 30+ 押さえる。

汎用 calc サイト（4devs、iCalculator、Calcule Mais）や法務ポータル（JusBrasil）が**出典を示さず**に出している計算、公式ツール（Receita Federal、INSS、Caixa、Calculadora do Cidadão）が**使いにくい**隙間を、出典付き・明快な UI で独自に埋める。

顧客は Google.com.br で検索するブラジル層、ブラジルのアフィリエイト網（Hotmart / Monetizze / Amazon Associados BR / Shopee Affiliate / 会計 SaaS）。

## Non-negotiable principles

1. **計算結果は絶対に正しいこと**。全ての計算ロジックは pure function、Vitest 単体テスト必須。テスト未通過でマージ禁止。
2. **YMYL（税務・労務・金融・健康）は慎重に**。運営者情報・出典・免責を明記、断定的助言は書かない。IRPF / INSS / FGTS / rescisão / aposentadoria はいずれも一般的な estimativa 扱いに留める。**個別の税務・労務・法律アドバイスは断定しない**（contador / advogado 領域）。
3. **scaled content abuse を避ける**。各ページに最低 500 語のユニーク文と独自視点。テンプレ流用のみは Google スパムポリシー対象（**AdSense「低価値コンテンツ」却下の主因なので最重要**）。
4. **静的優先**。計算はクライアント JS、ページは SSG → Cloudflare Pages。サーバーは持たない。
5. **計算機ごとに独立**。1 計算機 = 1 ディレクトリ。logic / meta / content / test 揃わないと公開しない。
6. **公的ソース最優先**。Receita Federal、INSS / Previdência、Caixa（FGTS）、Ministério do Trabalho、TST、Banco Central、IBGE、各州 SEFAZ 等の `gov.br` 一次ソースのみ参照。ブログ／会計事務所オウンドメディア／フィンテックブログの数値で書き換えない。Portugal（AT）の値は使わない。
7. **pt-BR**。本文はブラジルポルトガル語（pt-PT 禁止）。通貨は BRL（R$ 1.234,56＝カンマ小数・ピリオド千位）、日付は dd/mm/yyyy。

## Tech stack

- **Framework**: Next.js 15 (App Router, RSC), TypeScript strict mode
- **Styling**: Tailwind CSS（LTR）
- **Fonts**: `Inter`（本文）+ display フォント via `next/font/google`
- **Content**: MDX (`@next/mdx`)
- **Testing**: Vitest（計算ロジック必須）/ Playwright（E2E）
- **Hosting**: Cloudflare Pages
- **Analytics**: Google Analytics 4（`calculator_used` カスタムイベント、`NEXT_PUBLIC_GA4_ID`）+ Cloudflare Web Analytics + Google Search Console
- **Sitemap**: Next.js MetadataRoute.Sitemap
- **Structured data**: JSON-LD（`WebApplication` + `FAQPage` + `BreadcrumbList` + 編集デスク `Organization`、`inLanguage: 'pt-BR'`、`priceCurrency: 'BRL'`）

## Repository layout

```
/
├── app/
│   ├── (marketing)/         # Sobre, Contato, Aviso legal, Privacidade, Metodologia（pt-BR）
│   ├── c/[slug]/            # 計算機ページ（SSG）
│   ├── blog/                # ガイド記事（SSG）
│   ├── sitemap.ts
│   └── robots.ts
├── calculators/
│   ├── _template/
│   └── <slug>/              # 1 計算機 = 1 ディレクトリ
│       ├── meta.ts
│       ├── logic.ts
│       ├── logic.test.ts
│       ├── content.mdx
│       ├── form.tsx
│       ├── lede.ts
│       └── index.ts
├── components/
├── lib/
│   ├── site.ts              # SITE_NAME=Calcaza / SITE_LANG=pt-BR / SITE_DIR=ltr / SITE_CURRENCY=BRL
│   ├── editorial.ts         # EDITORIAL_DESK（Equipe Editorial da Calcaza）E-E-A-T 帰属
│   ├── seo.ts               # generateMetadata（タイトル上限はブランド接尾辞込み判定）
│   ├── jsonld.ts            # 構造化データ
│   └── format.ts            # Intl 経由の通貨/数値/% フォーマッタ（pt-BR / BRL）
├── docs/
│   └── site-context.md      # ロケール規則・通貨・出典 whitelist・タイトル上限（agent が起動時に読む）
├── public/
└── e2e/                     # Playwright
```

## Calculator module contract

各計算機ディレクトリは以下を必ず export する。

### `meta.ts`

```ts
import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-salario-liquido',
  title: 'Calculadora de Salário Líquido (2026)',
  description: 'Calcule quanto cai na conta a partir do salário bruto: descontos de INSS e IRRF na folha, com as tabelas oficiais de 2026.',
  primaryKw: 'calculadora salário líquido',
  relatedKws: ['salário líquido 2026', 'desconto inss salário', 'calcular irrf na folha'],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-05',
  updatedAt: '2026-06-05',
  faqs: [ /* 4-6 個必須 */ ],
  affiliates: [],
};
```

### `logic.ts`

```ts
export type Input = { /* ... */ };
export type Output = { /* ... */ };

export function calculate(input: Input): Output {
  // 純粋関数。副作用なし、外部依存なし、決定的。
}
```

### `logic.test.ts`

最低 5 ケース必須:

- 通常値（典型ケース）
- 境界値（faixa の INSS / IRRF 閾値、teto do INSS、dedução ぴったり）
- 異常値（負数、NaN、空文字 → 適切にハンドル）
- Receita Federal / INSS の公式 worked example と一致

### `content.mdx`

500 語以上の **pt-BR** 解説。以下のセクションを含めること:

1. O que esta calculadora faz?（このツールで何がわかるか）
2. A fórmula e de onde vêm as alíquotas（計算式と一次ソースリンク — tabela INSS / tabela IRRF / Lei / Caixa）
3. Como preencher os campos（入力項目の補足）
4. Exemplos práticos（最低 3 例 — CLT carteira assinada / autônomo / faixas diferentes de renda 等）
5. Erros comuns（よくある誤解 — salário bruto vs líquido、INSS empregado vs patronal、IRRF base de cálculo 等）
6. Calculadoras relacionadas（関連計算機への内部リンク 3-5 個）

### `form.tsx`

入力 UI。React Hook Form + Zod。LTR、Tailwind 標準クラス。ラベルは pt-BR。

## Common tasks

### 「新しい計算機 X を追加して」と言われたら

1. KW リサーチ: メイン KW（pt-BR）と関連 KW 3-5 個、Google.com.br 上位 10 件確認
2. `calculators/_template/` をコピーして `calculators/<slug>/` を作成
3. `logic.ts` 実装 + `logic.test.ts` で最低 5 ケース（Receita / INSS / Caixa の worked example を 1 件以上）
4. `content.mdx` で 500 語以上の pt-BR 解説
5. `meta.ts` に FAQ 4-6 個（質問と回答も pt-BR）
6. `pnpm test` 通過
7. `pnpm dev` で表示確認（`<html dir="ltr" lang="pt-BR">` であること）
8. Lighthouse 90+
9. PR 説明: 対象 KW / 想定検索意図 / 独自価値 / 連邦か州か（Federal / SEFAZ-州）

### 「KW リサーチして」と言われたら

採用基準:
- 月間検索ボリューム 200-5,000（Google.com.br）
- 上位 10 サイトに汎用 calc 大手（4devs / iCalculator / Calculadora Online）と法務ポータル（JusBrasil）が**出典付きの専用 UI** で 3 つ以上埋めていない
- ユーザー意図が明確（"calculadora"、"quanto"、"cálculo"、"valor"、"desconto"、"líquido" を含む）
- AdSense / アフィリエイト（Hotmart / Amazon BR / 会計 SaaS）の収益経路が見える

不採用基準:
- YMYL 深部（医療診断、個別の tax position、個別の労務紛争判断、specific legal advice）
- 公式サイトで完全に満たされる単純手続きクエリ
- 検索ボリューム < 100/月
- Portugal（AT）/ 他ルゾフォン国（地理的ミスマッチ）
- 生成系（gerador de CPF/CNPJ 等、4devs 支配＋規約リスク）

### pt-BR 口調

- **ブラジルポルトガル語のみ**。pt-PT（telemóvel / ecrã / autocarro / factura / IVA / casa de banho）を避ける。
- 通貨は BRL、Intl は `pt-BR`、R$ 表記（R$ 1.234,56）。
- ブラジル機関名はそのまま使用（"a Receita Federal"、"o INSS"、"a Caixa Econômica Federal"、"o Ministério do Trabalho"、"a CLT"、"o FGTS"）。
- 二人称は `você`。親しみやすいが砕けすぎない。スラング不可。

## SEO requirements per page

- **Title**: 60 文字以内（ブランド接尾辞「 | Calcaza」込みで判定）。メイン KW（"Calculadora ..."）を前方に。
- **Description**: 80-160 文字、何がわかるかを明記。
- **H1**: ページのメイン KW と一致。
- **構造化データ**: `WebApplication`（`inLanguage: 'pt-BR'`、`priceCurrency: 'BRL'`） + `FAQPage` + `BreadcrumbList` + 編集デスク
- **OGP 画像**: `opengraph-image.tsx` で動的生成
- **内部リンク**: 関連計算機 3-5 個
- **本文**: 500 語以上のユニーク解説
- **更新日**: `meta.ts` の `updatedAt` / `reviewedAt` を更新

## Monetization

- **AdSense**: 計算結果の上下、解説中に 1-2 スロット。過剰配置 NG。
- **アフィリエイト**: pt-BR / ブラジル文脈に合うもののみ
  - 税務 / MEI / 確定申告 → contabilidade online（Contabilizei 等）、会計 SaaS
  - 金融 / 銀行 → bancos / fintechs CPA（cartão / conta）
  - 物販 → Amazon Associados BR、Shopee Affiliate、Mercado Livre、Magalu
  - デジタル商材 → Hotmart / Monetizze / Eduzz
- **絶対 NG**: ポップアップ、無関係な広告ゴリ押し、計算機より広告が目立つレイアウト

## Quality bar（公開前チェックリスト）

- [ ] `logic.test.ts` 全パス
- [ ] Lighthouse モバイル: Performance / SEO / Accessibility / Best Practices すべて 90+
- [ ] 主要 KW で Google.com.br 上位 10 件確認、独自価値が明確
- [ ] スマホ実機で操作確認
- [ ] 構造化データテストツールでエラーなし
- [ ] 内部リンク 3 個以上
- [ ] 免責事項（YMYL 該当時）
- [ ] pt-PT 方言（telemóvel / ecrã / factura / IVA）混入チェック

## Things Claude Code should NOT do

- 計算ロジックを LLM 出力そのまま貼り付け（必ずテスト検証）
- AI 生成の薄いコンテンツのみで 500 語を埋める
- YMYL の判断を断定（"Você vai pagar R$ X" ではなく "o valor aproximado é R$ X" 系の言い回し）
- 4devs / JusBrasil / Receita 等のレイアウトや文章をコピー
- スパム的に大量ページを一気に公開（1 日 2-3 本ペース）
- 計算結果の正確性を犠牲にして UI や表現を優先
- pt-PT 方言混入（telemóvel / ecrã / autocarro / factura / IVA 等）
- 個別の税務・労務・法律アドバイスの断定（advogado / contador 領域）

## Working with this repo as Claude Code

- 計算ロジックを実装/修正したら必ず `pnpm test`
- MDX 変更はビルド確認まで
- 1 PR = 1 計算機（または 1 機能）
- 不確実な点は実装前に質問
- 既存スタイルに従う（`pnpm lint`）

## 初回計算機を追加するときの注意

`calculators/registry.ts` には seed として `calculadora-salario-liquido`（INSS + IRRF + 2026 redutor）を登録済。`posts/registry.ts` には seed ガイド `salario-bruto-vs-liquido-2026` を登録済。**注意**: `output: 'export'` では `/c/[slug]` と `/blog/[slug]` の `generateStaticParams()` が**空配列だとビルドが落ちる**（"missing generateStaticParams()"）。したがって計算機・記事を全削除しないこと。新規追加時は `pnpm build` で17ページ生成を確認する。
