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

## 出典リンクの検証

出典リンクが**引用した法令・公告そのものを指しているか**は
`~/Desktop/PSEO/scripts/verify-sources.mjs` で機械検証する。

- 計算機・記事を追加／出典を差し替えたら走らせる（**7サイト全部**。1サイトだけの走行はゲートにならない）:
  `cd ~/Desktop/PSEO && node scripts/verify-sources.mjs all --json > /tmp/vs.json`
  `node scripts/verify-sources-diff.mjs .verify-sources/baseline.json /tmp/vs.json`
- **通す条件は「新規の MISMATCH / DEAD がゼロ」＋「検査量が基準から落ちていない」**。
  全件ゼロではない（既存バックログがあり、全件ゼロにすると永久に赤になる）。
  exit 1 = 新規あり / exit 2 = 使い方の誤り / exit 3 = 検査量の縮退（緑でも「検査できていない」状態）
- 直したら基準を更新する（**同じく all の走行から。基準ファイルへ直接リダイレクトしない**）:
  `node scripts/verify-sources.mjs all --json > /tmp/vs.json`
  `node scripts/verify-sources-diff.mjs --compact /tmp/vs.json > /tmp/baseline.json && mv /tmp/baseline.json .verify-sources/baseline.json`
  基準は7サイトで共有している1ファイルなので、**1サイトだけの走行から作ると他サイトの
  検査量の下限が消える**（そのため `--compact` は `all` 以外を拒否する）。
  直接リダイレクトすると、拒否されただけでもシェルが基準を空にしてしまう
- **この ✅ は「今回走らせたサイト」についてだけの話。** 走らせていないサイトについては
  何も言っていない（基準に載っていないサイトも同じ）
- 出力の①要修正・②要確認（識別子）だけ読む。③以降はノイズが多い
- **`OK(弱)` は「検証済み」ではない**。URL の slug と取得先の表題が整合しているだけで、
  引用の正しさは見ていない
- **`OK` も「表題での確認」とは限らない。** identity には本文の先頭 1,200 字が入るので、
  短いページでは本文中の言及で緑になる（実測 2 件）
- **`NO-CLAIM` が増えても差分ゲートは通る。** 検証できない引用が増えることは
  「新規の MISMATCH/DEAD」ではないので赤にならない。出力の ⚠️ 行を読むこと。
  **✅ は「増やした引用を検査した」という意味ではない**
- **このツールは数値・料率が出典と一致するかは検証しない。**
  非公的ホストの引用（keisanya は 38%）は検査対象にすら入らない

出典を書くときの原則: **ラベルに法令識別子を書く。**
「全國法規資料庫」ではなく「《勞動基準法》第50條（全國法規資料庫）」、
「pajak.go.id」ではなく「PMK 81/2024（pajak.go.id）」。
機関名だけのラベルは NO-CLAIM になり、何も検証されない。

ただし**リンク先が官庁の解説ページなら、法令識別子を書くと MISMATCH になる**。
解説ページの表題に法令名は無いので「取得先に見当たらない」と判定される。
**法令名をラベルに書くなら法令本文の URL を、解説ページを引くならページ名をラベルにする。**
（例: `厚生年金保険法 第58〜62条` → e-Gov の条文へ。日本年金機構の解説ページなら
`遺族厚生年金（日本年金機構）` とページ名で書く）

詳細と既知の限界: `~/Desktop/PSEO/docs/verify-sources-coverage.md`

### 定数と本文の乖離を防ぐ

**繰り返し起きている失敗の型**: 定数はある文で更新されるが、
**その定数から導いた積が次の文に生き残る**。`logic.test.ts` は正しい値を
assert しているので、テストでは落ちない。落ちないのは本文だけである。

実例（すべて本番で発生）:

- `logic.ts` の軽車両上限を 12,300 に直したのに、本文8箇所が 12,200 のまま
- 「48,000 − 32,000 = **US$16,700**」（正 16,000）が残った
- 閾値だけ更新して積を更新せず、**ページとウィジェットが US$286 食い違った**
- 「FPL **2026** = US$15,650」— 値は正しいが**年ラベルが誤り**
  （2026年の FPL は US$15,960。15,650 は plan-year 2026 に適用される 2025年版）
- 無効化された規則の値 US$844/週を「現行」として配信していた

#### 定数を変えたら必ずやること

1. **本文の追随を機械で確認する。** 変更をコミットする前に、共通基盤リポで:

   ```bash
   cd ~/Desktop/PSEO
   npm run constant-drift -- <site> --slug=<slug> --since=<変更前のコミット>
   ```

   `--since` を付けると、git から「旧値」と「新値の要求」を自動で作る。
   台帳に何も書かなくても、**旧値の残存**と**新値の不在**の両方が課される。

2. **旧値と、そこから導いた積を台帳に登録する。**
   `~/Desktop/PSEO/scripts/constant-drift/retired/<site>.json`

   ```json
   {
     "calculators": {
       "<slug>": {
         "retired": [
           { "value": 12200, "note": "TY2025 の軽車両上限", "replacedBy": "LIGHT_AUTO_CAPS.2026.firstYearNoBonus" },
           { "value": 20200, "note": "12,200 + 8,000 の旧合計" },
           { "value": 7973,  "note": "旧合計 36,240 × 22% の節税額" }
         ]
       }
     }
   }
   ```

   **積を書き忘れると捕まらない。** 定数そのものは git から自動導出できるが、
   合計・節税額・例示の月額は人が書くしかない。
   `replacedBy` に定数名を書くと、対比の説明（「現行は X、旧値は Y」）を自動で許す。

3. **年を名乗る値は、その年を述べている出典を指せるようにする。**
   「2026年の値」と書けるのは、**出典が 2026 と名乗っている**ときだけ。
   別の年の表を当年に適用している場合は、記録様式に適用年度を持たせる:

   ```json
   "provenance": [
     {
       "constant": "FPL_PLAN_YEAR_2026_BASE_USD",
       "value": 15650,
       "appliesToYear": "2025",
       "source": "HHS 2025 Poverty Guidelines (90 FR 3424)",
       "note": "plan-year 2026 に適用するが、2026年の FPL は US$15,960 で別物"
     }
   ]
   ```

   本文で年を名乗るときは `appliesToYear` と一致させるか、
   **「◯年に適用される」という限定表現**（`aplicable al` / `que rigen` /
   `applies to` / 「に適用」）を付ける。**裸の年ラベルは不可。**

4. **現行値が本文に載っていることを assert する（推奨・最も強い）。**

   ```json
   "assert": [
     { "constant": "FLSA_SALARY_LEVEL_WEEKLY", "files": ["content.mdx"] }
   ]
   ```

   旧値の走査（否定スキャン）は**言い回しで抜けられる**（「現行の閾値は
   US$844/週だが、〜ではない」は素通りする）。現行値の存在を要求するほうが強い。
   **本文が定数の識別子を参照している場合（単一ソース化）は自動で満たされる。**

#### 本文で数値を書くときの規約

- **定数から生成できるなら生成する。** `form.tsx` の hint のように
  `` `${fmtCurrency(CAPS[year].x)}` `` と書けば、乖離は構造的に起きない。
  これが根本解決であり、新規実装では既定の書き方にする
- **例示の計算は式を書く。**「48,000 − 32,000 = US$16,000」と式で書けば
  機械が検算できる。結果だけ書くと検算できない
- **旧値に言及するときは、現行値を同じ段落に併記する。**
  「現行は US$684/週。US$844 は無効化された 2024年規則の数字」の形にする。
  段落をまたぐと機械が対比だと判定できない
- **比較表の「前年」列も更新する。** 当年の列だけ直して前年列を放置する事故が
  実際に起きている（`year-column` ルールが落とす）

#### 完了の定義

**`npm run constant-drift -- <site>` が指摘ゼロで終わるまでが完了。**
`exit 3`（カバレッジ不足）は「検査できていない」であって「問題なし」ではない。
`1` と混同しないこと。

限界は `~/Desktop/PSEO/docs/constant-drift-coverage.md` に実測で書いてある。
**「指摘ゼロ＝正しい」ではない**（年キーの定数群は 370 本中 4 群しかなく、
自動ルールの射程は狭い）。
