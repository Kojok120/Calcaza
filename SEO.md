# SEO.md — Programmatic SEO 計算機サイト 実装ノウハウ集（keisanya 由来 → alhasiba 用に要再監査）

> ⚠️ **AR 版未監査**: 本ドキュメントは `keisanya`（日本語版）から継承された SEO 規約。AR / GCC 市場向けに以下の差し替えが必要。
> - `ja_JP` → `ar_SA` ロケール、`Noto Sans JP` → `Noto Sans Arabic` + `Tajawal`、円（¥/JPY）→ SAR/AED
> - 日本語の文字数換算（30 字 / 120 字）→ アラビア語のグラフェム換算（タイトル 60 文字、ディスクリプション 160 文字目安）
> - JP 検索特性（モバイル 70%、CASIO keisan.site 競合）→ GCC 検索特性（モバイル 80%+、Google.sa/Google.ae、AI Overviews 対応 2025/05〜）
> - 大手競合の名前（CASIO・大手金融機関）→ GCC 大手（zatca.gov.sa、tax.gov.ae、各国中央銀行、Bayut、Property Finder）
>
> 以下の本文は再監査前の JP 版そのまま。アーキテクチャ層（構造化データ、Lighthouse 指標、Web Vitals 等）は AR でも有効。

---

> **対象プロジェクト**: `alhasiba`（GCC・アラビア語 MSA のニッチ計算機を 30+ 本展開する PSEO サイト）
> **技術スタック**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Cloudflare Pages（SSG 配信）
> **収益モデル**: AdSense + GCC 文脈関連アフィリエイト
> **本ドキュメントの位置づけ**: ページ単位 SEO 設定ノウハウ。原則→実装パターン→コード例→アンチパターンの順で構成。

---

## 0. 全体方針：2026年のPSEOで生き残る前提条件

PSEOは2024年3月のGoogleコアアップデート以降、**「scaled content abuse（大量生成コンテンツの悪用）」**ポリシーで明確に取り締まりの対象になりました。Googleは「自動化・人手・ハイブリッドかを問わず、検索順位操作目的で大量にページを生成する行為」をスパムと定義しています([Google Search Central Blog](https://developers.google.com/search/blog/2024/03/core-update-spam-policies))。2024年3月の取り締まりだけで「低品質・非オリジナル」コンテンツが検索結果から45%削減されました([Google Blog](https://blog.google/products-and-platforms/products/search/google-search-update-march-2024/))。

ただし**Googleは「方法」ではなく「意図と価値」を問題視**しています。Zapierが7万ページのプログラマティックSEOで$140M ARRを達成している事実([guptadeepak.com](https://guptadeepak.com/the-programmatic-seo-paradox-why-your-fear-of-creating-thousands-of-pages-is-both-valid-and-obsolete/))が示すように、**「独自データレイヤー」と「個別ページごとの一意の価値」**を持つPSEOは依然として有効です。

このドキュメントの全実装ルールは、以下の3つの「絶対条件」に従います：

1. **各計算機ページは"独立した道具"であること**：30本の計算機はすべて入力スキーマ・計算ロジック・出力UIが異なる固有の機能を持つ。テンプレートで生成された差分のみのページは作らない。
2. **解説テキストは500語以上の独自ライティング**：計算式の解釈、典型的な使用シーン、よくある誤用、関連法規制（YMYL領域では特に）を、計算機ごとに専門家視点で書き下ろす。AIで下書きしてもよいが**人間が必ずレビュー・追記する**。
3. **2025年8月のGoogleスパムアップデート以降の運用基準**：8月26日のスパムアップデートでprogrammatic/thin contentが追加で取り締まりを受けています([rebelmouse.com](https://www.rebelmouse.com/google-spam-update-2025))。テンプレート流用率は30%以下、各ページ独自要素70%以上を目安とします。

---

## 1. Titleタグの書き方（日本語）

### 原則

- **Q1 2025の最新研究で、Googleはタイトルの76%を書き換えています**（2023年は61%）([Search Engine Land](https://searchengineland.com/google-changed-76-of-title-tags-in-q1-2025-heres-what-that-means-454847))。書き換えられなかった24%の特徴は、**平均44.47文字・7.39語・30〜60文字レンジに収まるシンプルなタイトル**でした。
- Googleの公式ガイダンスは「概念的・記述的で簡潔」であること、HTMLタイトルタグは依然として80%以上の確率で表示元として使われています([Google Search Central Blog](https://developers.google.com/search/blog/2021/08/update-to-generating-page-titles))。
- **Pixel幅が真の制約**：デスクトップ約600px / モバイル約480px。日本語1文字は全角でおよそ20px。**日本語は28〜32文字に収めるのが現実的な上限**([wpic.co](https://wpic.co/blog/mastering-japanese-seo-10-key-strategies/))。
- **主要KW前方一致**：Googleが書き換えなかったタイトルの85%は30〜60文字レンジで、フォーカスKWを冒頭に置いていました([searchengineland.com](https://searchengineland.com/google-changed-76-of-title-tags-in-q1-2025-heres-what-that-means-454847))。
- **ブランド名はサフィックス（末尾）**：日本語SEOではブランド名を末尾に配置するのが一般的。Googleが鎖の途中に勝手にブランド名を付加するケースもあるため、二重表示を避ける。

### 実装パターン（計算機ページ向け）

推奨フォーマット：
```
[計算機名]｜[何を計算するか1文]｜[サイト名]
```
- 例：`電気代シミュレーター｜契約アンペア・使用量から月額を即計算｜計算屋`
- 例：`住宅ローン繰上返済シミュレーター｜期間短縮vs返済額軽減｜計算屋`

**文字数目安**：全角28〜32文字（半角・数字含む実測でモバイル480px以内）

### コード例（Next.js 15 + TypeScript / App Router）

```typescript
// app/c/[slug]/page.tsx
import type { Metadata } from 'next';
import { getCalculatorBySlug } from '@/lib/calculators';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCalculatorBySlug(slug);
  if (!c) return { title: 'Not Found' };

  // 主要KWを前方に、ブランド名は末尾、separatorは「｜」
  const title = `${c.name}｜${c.shortBenefit}｜計算屋`;

  return {
    title,
    // metadataBase設定で相対URL化
    alternates: { canonical: `/c/${slug}` },
    // OGタイトルは別途指定可能（titleと同一でよい）
    openGraph: { title, type: 'website' },
    twitter: { title, card: 'summary_large_image' },
  };
}
```

**`metadataBase` をルートレイアウトで一度だけ設定**：
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://keisanya.com'),
  title: { default: '計算屋', template: '%s' },
};
```
※ `template: '%s'` にしておくと、子ページが完全な文字列で上書きできる。`%s | 計算屋` は二重ブランディングになるので**使わない**。

### やってはいけないこと

- ❌ KWスタッフィング：`電気代計算 電気代シミュレーター 電気料金 月額 アンペア`
- ❌ ブランド名を冒頭に置く：`計算屋 - 電気代シミュレーター`（モバイルでKWが切れる）
- ❌ `[2026年最新]` のような時限ワードを乱用→翌年自動的に陳腐化、Google書き換え対象になりやすい
- ❌ 60文字超え：書き換え率が劇的に上昇。32文字以内に収める
- ❌ 全ページで同じテンプレ：`[計算機名]の使い方 | 計算屋` のように差分が機械的だと、Googleはサイト全体を「scaled content」と判定するリスクが上がる

---

## 2. Meta Descriptionの書き方（日本語）

### 原則

- **GoogleはDescriptionの62〜70%を書き換える**（snippetは検索クエリに応じて動的生成される）([seovendor.co](https://seovendor.co/the-ideal-title-and-meta-description-2025-best-practices/))。**ランキング要因ではない**が、**CTR（クリック率）に直結する**唯一のメタ情報。
- Pixel上限：デスクトップ約920px / モバイル約680px([metatagtester.com](https://www.metatagtester.com/))。日本語では**全角120〜140文字**を目安とし、**最重要メッセージは前方80文字以内**に置く（モバイルで切れる位置）。
- Googleは曖昧・KW詰め込み・page内容と乖離したDescriptionを書き換えやすい([webindiainc.com](https://www.webindiainc.com/google-increases-title-description-length-team-respond/))。

### 実装パターン（計算機ページ向け）

```
[1文目: 何ができる計算機か]→[2文目: 入力項目と出力の具体]→[3文目: 信頼性/独自要素の訴求]
```

例（電気代シミュレーター）：
> 契約アンペア・電力会社・月間使用量(kWh)から、燃料費調整額・再エネ賦課金まで含めた毎月の電気代を即時計算。2026年4月の託送料金改定に対応。30秒で他社比較も可能なツールです。

### コード例

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCalculatorBySlug(slug);
  // 1. 機能説明、2. 入出力項目、3. 独自/信頼要素 を1〜3文で
  const description =
    `${c.descLine1} ${c.descLine2} ${c.trustHook}`.slice(0, 140);
  return {
    description,
    openGraph: { description },
    twitter: { description },
  };
}
```

### やってはいけないこと

- ❌ 「〜の計算ができます。ぜひご利用ください。」のような汎用末尾→書き換え対象
- ❌ 全ページ同一の固定文（テンプレに変数1個だけ差す）
- ❌ 160文字超：モバイルで「…」切断、CTAが消える
- ❌ HTMLタグや絵文字スタンプの過剰使用→Googleが無視するシグナル
- ❌ ページ本文に存在しない単語をDescriptionに入れる→snippet書き換え確率が上がる

---

## 3. 見出し階層（H1〜H6）の最適化

### 原則

- **H1は各ページに1つ**。日本語SEOでは「H1とTitleが意味的に一致」していることが重要。Googleは2021年以降、H1や視覚的に大きい見出しもタイトル生成の参照元にしている([Google Search Central Blog](https://developers.google.com/search/blog/2021/08/update-to-generating-page-titles))。
- **AI Overviewsの引用シグナルとしてもH1〜H3の階層は重要**：CXLの調査では、AI Overviewsに引用される回答の55%がページの上位30%エリアから抽出されており([CXL](https://cxl.com/blog/google-ai-overview-citation-sources/))、見出し直後の最初の1〜2文は「引用ターゲット」として最適化すべき。
- **計算機ページのH2は機能ブロックを明示**：「使い方」「計算式・根拠」「FAQ」「関連計算機」など、Googleとユーザー双方がページ構造を即座に把握できる構造にする。

### 計算機ページの推奨テンプレート構造

```
H1: [計算機名]（例：電気代シミュレーター）
└─ [計算機UI ブロック]
└─ H2: 計算結果の見方（結果が出た直後に配置）
└─ H2: [計算機名]の使い方
   ├─ H3: 入力項目の意味
   ├─ H3: よくある入力ミス
└─ H2: 計算式・根拠
   ├─ H3: 計算ロジック
   ├─ H3: 出典・参考データ
└─ H2: よくある質問（FAQ 5〜8件）
└─ H2: 関連する計算機（内部リンク）
```

### コード例

```tsx
// app/c/[slug]/page.tsx
export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const c = await getCalculatorBySlug(slug);

  return (
    <article>
      <Breadcrumbs items={c.breadcrumb} />
      <h1 className="text-2xl font-bold">{c.name}</h1>
      {/* 計算機UI（独立コンポーネント） */}
      <CalculatorWidget config={c.config} />

      <section aria-labelledby="how-to-read">
        <h2 id="how-to-read">計算結果の見方</h2>
        <p>{c.howToReadResult}</p>
      </section>

      <section aria-labelledby="how-to-use">
        <h2 id="how-to-use">{c.name}の使い方</h2>
        <h3>入力項目の意味</h3>
        {/* … */}
      </section>

      <section aria-labelledby="formula">
        <h2 id="formula">計算式・根拠</h2>
        {/* MathJax/KaTeXで数式を可視化、出典URLを明記 */}
      </section>

      <FAQSection items={c.faqs} /> {/* 内部でJSON-LDも出力 */}
      <RelatedCalculators current={slug} />
    </article>
  );
}
```

**アンカーリンクをFAQ・H2に付与**：`#how-to-read` のようなフラグメントは、AI Overviewsが「Read more deep links」として検索結果に表示するケースが2026年に増えています（Googleが2026年4月にdeep links機能のベストプラクティスを公表）。

### やってはいけないこと

- ❌ H1を複数配置（特にロゴをH1にしているテンプレ）
- ❌ H1にKWを2つ以上詰め込む（`電気代シミュレーター・電気料金計算ツール`）
- ❌ デザイン目的でH3→H2→H4と階層をスキップ
- ❌ 計算機UIだけのページ（解説H2なし）→AdSenseの「Low value content」で却下されやすい

---

## 4. 構造化データ（JSON-LD）の最適配置

### 原則：2025-2026の動向まとめ

- **FAQPageリッチリザルトは2023年8月に大幅縮小**。現在は「権威性のある政府・医療系サイト」のみリッチリザルト表示([Google Search Central Blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes))。**ただしFAQPage schema自体は引き続き有効**で、2025年6月にGoogleが7種類のschemaを廃止した中でもFAQPageは"keepers"として残されました([getpassionfruit.com](https://www.getpassionfruit.com/blog/faq-schema-for-ai-answers))。AI Overviewsに引用されるシグナルとして依然有効。
- **HowToリッチリザルトは2023年9月に完全廃止**（モバイル→デスクトップとも）([Google Search Central Blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes))。HowTo schemaは付けても害はないが、リッチリザルトは出ない。
- **2025年6月、Googleは7種のschema feature（Book Actions、Course Info、Claim Review、Vehicle Listing等）をリッチリザルトから廃止**([engagecoders.com](https://www.engagecoders.com/google-retires-7-structured-data-features-to-streamline-search-results/))。**ランキングへの影響はない**がリッチリザルトは消える。
- **Google公式推奨フォーマットはJSON-LD**。計算機ページに有効な現行schemaは：`SoftwareApplication`/`WebApplication`、`FAQPage`、`BreadcrumbList`、`Organization`/`WebSite`(サイト全体)、`Article` (解説部分)。

### 計算機ページに最適な5つのschema構成

1. **`WebApplication`または`SoftwareApplication`**（計算機本体を機械可読に説明）
2. **`BreadcrumbList`**（パンくず：今でも検索結果でURL表示が改善）
3. **`FAQPage`**（FAQセクション：AI Overviews引用ターゲット）
4. **`WebSite`**（ルートに1度だけ：sitelinks search box対応）
5. **`Organization`**（運営者情報：E-E-A-Tのtrust signal）

### 実装パターン：`@graph` で1つのscriptに統合

複数schemaを別々の`<script>`で出すよりも、**`@graph`で1つにまとめて`@id`でリンクさせる方が「knowledge graph」として強いシグナル**([aiso-hub.com](https://aiso-hub.com/insights/author-schema-markup/))。

### コード例（計算機ページの完全なJSON-LD）

```typescript
// lib/schema.ts
export function buildCalculatorPageSchema(c: Calculator, baseUrl: string) {
  const pageUrl = `${baseUrl}/c/${c.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}#app`,
        name: c.name,
        url: pageUrl,
        description: c.description,
        applicationCategory: c.category, // 例: 'FinanceApplication'
        operatingSystem: 'Any (Web Browser)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
        inLanguage: 'ja',
        isAccessibleForFree: true,
        publisher: { '@id': `${baseUrl}#org` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: c.breadcrumb.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: i === c.breadcrumb.length - 1 ? undefined : `${baseUrl}${b.path}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: c.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}#org`,
        name: '計算屋',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: ['https://twitter.com/calculators_jp'],
      },
    ],
  };
}

// app/c/[slug]/page.tsx
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = await getCalculatorBySlug(slug);
  const schema = buildCalculatorPageSchema(c, 'https://keisanya.com');

  return (
    <>
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTMLが必要（Reactのescape回避）
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* page contents */}
    </>
  );
}
```

### `WebApplication` の必須/推奨プロパティ

| プロパティ | 必須？ | 値の例 |
|---|---|---|
| `@type` | 必須 | `WebApplication` または `SoftwareApplication` |
| `name` | 必須 | `電気代シミュレーター` |
| `url` | 必須 | ページURL |
| `applicationCategory` | 推奨 | `FinanceApplication` `HealthApplication` 等([Schema.org](https://schema.org/SoftwareApplication)) |
| `operatingSystem` | 必須 | `Any (Web Browser)` |
| `offers` | 推奨 | 無料なら`price: "0"` |
| `browserRequirements` | 推奨 | `Requires JavaScript.` |
| `inLanguage` | 推奨 | `ja` |
| `aggregateRating` | 任意 | **実際のレビューがある時のみ**。ない場合は付けない（虚偽はpolicy違反） |

### `FAQPage` で引き続き効く理由

- リッチリザルトは出なくても、AI Overviews/Geminiは構造化データを引用判断のシグナルとして使う([surferseo.com](https://surferseo.com/blog/ai-citation-report/))。
- Bing/Yahoo!Japanは引き続きFAQリッチリザルトを表示するケースがある([epicnotion.com](https://www.epicnotion.com/blog/faq-schema-in-2025/))。
- ページ内に「目に見えるFAQ」が無いのにschemaだけ書くのは違反。**ページに表示されているQ&Aと完全一致**させる。

### 検証方法

- **Googleリッチリザルトテスト**：https://search.google.com/test/rich-results
- **Schema Markup Validator**：https://validator.schema.org/
- 開発時はpre-deployで自動実行（`npm run validate-schema`）

### やってはいけないこと

- ❌ `aggregateRating`をユーザーレビュー無しで偽造（manual action対象）
- ❌ HowTo schemaに過剰投資する（リッチリザルト2023年9月廃止）
- ❌ ページに表示されないFAQをschemaだけに書く（policy違反）
- ❌ 1ページに同じschemaを複数script tagで重複出力
- ❌ 廃止schema（Book Actions等）を残す（コード汚染、リッチリザルト出ない）

---

## 5. 内部リンク戦略（PSEO向け）

### 原則

- **Googleは「100〜150リンクが上限」という古い目安を撤回済み**。John Muellerは「1ページに数千リンク張れるが、増やしすぎると個々のリンクの値が薄まる」と発言([searchenginejournal.com](https://www.searchenginejournal.com/google-cautions-against-using-too-many-internal-links/412553/))。Zyppyの調査では**45〜50リンクが効果のピーク**で、それ以降は効果が逆転([inblog.ai](https://inblog.ai/blog/how-many-internal-links-per-page-seo))。
- **PSEOは「ハブ&スポーク」がベスト**：完全サイロは硬すぎ、PSEOの大量ページでは「カテゴリハブ→計算機」「計算機→関連計算機」の二層構造が最適。
- **アンカーテキストは"記述的・自然"**：完全一致KWで30%、部分一致40%、自然文30%程度の比率がGoogle 2024 leak文書（QualityCopiaFireflySiteSignal等）の分析でも安全とされる([hobo-web.co.uk](https://www.hobo-web.co.uk/firefly/))。

### 計算機サイトのトポロジー設計

```
ホーム (/)
├─ カテゴリハブ (/c/finance, /c/health, /c/daily)  ← ピラーページ
│   ├─ 計算機A (/c/finance/loan-prepayment)
│   ├─ 計算機B (/c/finance/electricity-bill)
│   └─ 計算機C (/c/finance/...)
└─ Aboutページ・運営者情報・プライバシーポリシー
```

各計算機ページから出る内部リンク：
1. **パンくず（必須）**：ホーム→カテゴリ→現在ページ
2. **同一カテゴリの関連計算機3〜5本**（記述的アンカー：例 `住宅ローン繰上返済シミュレーター`）
3. **異カテゴリの関連計算機1〜2本**（横の連携：例「BMI」→「カロリー計算」）
4. **解説本文中のコンテキストリンク2〜4本**（自然文中で関連用語にリンク）

合計：1ページから10〜15本の内部リンク（ナビ・フッター除く）

### コード例

```tsx
// components/RelatedCalculators.tsx
import { getRelatedCalculators } from '@/lib/calculators';
import Link from 'next/link';

export function RelatedCalculators({ currentSlug, category }: Props) {
  const related = getRelatedCalculators(currentSlug, category, 5);
  return (
    <section aria-labelledby="related">
      <h2 id="related">関連する計算機</h2>
      <ul>
        {related.map((r) => (
          <li key={r.slug}>
            <Link href={`/c/${r.slug}`}>
              {/* アンカーは計算機の正式名称（記述的、自然） */}
              {r.name}
            </Link>
            <span>— {r.shortBenefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### パンくずナビ実装（視覚 + JSON-LD 完全一致）

```tsx
// components/Breadcrumbs.tsx
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path}>
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link href={item.path}>{item.name}</Link>
                  <span aria-hidden> › </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

**重要**：JSON-LDのBreadcrumbListと、visible breadcrumbの**順序・名称が完全一致**していること。乖離するとリッチリザルトが剥奪される([glukhov.org](https://www.glukhov.org/post/2025/12/breadcrumbs-for-seo/))。

### やってはいけないこと

- ❌ 全ページから「ホーム」「お問い合わせ」だけにリンク
- ❌ 同じアンカーテキストを多数のページに繰り返す（`こちら`、`詳しくはこちら`）
- ❌ アンカーKWをすべて完全一致で揃える（過剰最適化シグナル）
- ❌ 同じページから同じ宛先に5本も6本も内部リンク（最初の1本以外PageRankが薄まるとされる）
- ❌ パンくずがJSON-LDだけで画面に存在しない

---

## 6. URLスラッグの設計

### 原則

- **日本語URL（kanji/ひらがな）はSEO的に有利不利は無い**：Googleの公式見解は「クロール・インデックス・ランキングに問題なし」([edamamejapan.com](https://edamamejapan.com/japan-seo/))。
- **しかしPunycode/Percent-encodingで実用上問題が多い**：`/c/電気代` を共有/ペーストすると `/c/%E9%9B%BB%E6%B0%97%E4%BB%A3` になる。SNSでURLが醜く見え、CTRに悪影響。
- **結論：URLはローマ字または英語、日本語はTitle/H1/本文で**。これが日本語SEO実務家のコンセンサス([wpic.co](https://wpic.co/blog/mastering-japanese-seo-10-key-strategies/))([mailmate.jp](https://mailmate.jp/blog/japanese-seo))。
- **カテゴリパスは含める** (`/c/[slug]` 型)：シンプルなフラットURLは可読性が高くPageRankの集中も良い。深い階層 (`/finance/loan/prepayment/...`) は避ける。

### 推奨URL構造

```
ホーム:           /
カテゴリ:         /c/finance
                  /c/health
                  /c/daily
個別計算機:       /c/finance/loan-prepayment
                  /c/health/bmi
                  /c/daily/electricity-bill
About:           /about
運営者情報:       /about/operator
プライバシー:     /privacy
免責事項:         /disclaimer
```

スラッグ命名規則：
- 全部小文字、ハイフン区切り（`loan-prepayment`、NOT `loan_prepayment`）
- 短く（3〜5語、20〜40文字）
- 計算機の本質を表すローマ字・英語：`bmi-calculator` ではなく `bmi`（重複の "calculator" は不要）
- 数字の使用OK：`401k-simulator`、`2026-tax`

### コード例（Next.js 15のApp Router）

```typescript
// app/c/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getCalculatorBySlug, getAllCalculators } from '@/lib/calculators';

// SSG: ビルド時に全パスを生成
export async function generateStaticParams() {
  const all = await getAllCalculators();
  return all.map((c) => ({ category: c.category, slug: c.slug }));
}

export const dynamicParams = false; // 未知のslugは404

type Props = { params: Promise<{ category: string; slug: string }> };

export default async function Page({ params }: Props) {
  const { category, slug } = await params;
  const c = await getCalculatorBySlug(slug);
  if (!c || c.category !== category) notFound();
  return <CalculatorPage calculator={c} />;
}
```

### やってはいけないこと

- ❌ `/c/電気代計算機/` のような日本語URL（Punycodeで共有が醜い）
- ❌ `/calculator-tools/category/finance/electricity-bill-calculator-2026/` のような長く深い階層
- ❌ クエリパラメータでルーティング（`/calc?id=123`）→canonical問題が頻発
- ❌ 末尾スラッシュを統一しない（`/c/bmi` と `/c/bmi/` が別URLになる）
- ❌ アンダースコア区切り（Googleは単語境界として認識しにくい）

---

## 7. Core Web Vitals最適化（INP重視）

### 原則

- **2024年3月、INPがFIDを置き換えてCore Web Vitalの正式メトリックに**([web.dev](https://web.dev/blog/inp-cwv-launch))。閾値：**Good ≤ 200ms（75パーセンタイル）**。
- 2025 Web Almanacでは、モバイルページの77%がGood INPだが、トラフィック上位サイトでは53%しか通っていない（複雑なJSが原因）([corewebvitals.io](https://www.corewebvitals.io/core-web-vitals/interaction-to-next-paint))。
- **計算機UIはINPの典型的な弱点**：onChangeで重い再計算を走らせると入力遅延が出る。
- LCP < 2.5s、CLS < 0.1、INP ≤ 200ms を全ページで維持する。

### 実装パターン

#### 7.1 計算機UIのINP対策

```tsx
// components/CalculatorWidget.tsx
'use client';
import { useState, useDeferredValue, useTransition } from 'react';

export function CalculatorWidget({ config }: Props) {
  const [input, setInput] = useState(initialInput);
  // useDeferredValueで重い計算を低優先度に
  const deferredInput = useDeferredValue(input);
  const [isPending, startTransition] = useTransition();

  // 入力反映は即時、結果計算はtransitionで遅延
  const handleChange = (key: string, value: number) => {
    startTransition(() => {
      setInput((prev) => ({ ...prev, [key]: value }));
    });
  };

  // useMemoで計算をキャッシュ
  const result = useMemo(() => calculate(deferredInput), [deferredInput]);

  return (
    <div>
      <InputForm value={input} onChange={handleChange} />
      <ResultDisplay result={result} isPending={isPending} />
    </div>
  );
}
```

**ポイント**：
- `useDeferredValue` / `useTransition` でメインスレッドをブロックしない（React 18の concurrent feature。Next.js 15のApp Routerは標準で活用)([Vercel KB](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024))。
- 入力反映は即座、計算は遅延。INPの「processing delay」が劇的に減る。
- 重い計算（500行以上のJS）は **Web Workerに退避**することも検討。

#### 7.2 LCP対策

- ヒーローセクションにテキスト+UIのみ（**画像を入れない**）→画像LCPの問題が消える。
- 主要フォントは `next/font` で **self-host + preload**：

```typescript
// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'], // CJKは別途
  display: 'swap',
  preload: true,
  weight: ['400', '700'],
  variable: '--font-noto',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja" className={notoSansJP.variable}>{children}</html>;
}
```

#### 7.3 CLS対策

- 画像には必ず `width`/`height`（または`aspect-ratio` CSS）。
- AdSense広告は**領域を予約**：固定heightのコンテナ内に配置（`<div style={{minHeight: '280px'}}>`）。広告未読込でも空間が確保される。
- フォントは `font-display: swap` + 適切なフォールバック（`adjustFontFallback: true`）。

#### 7.4 Web Vitalsの監視

```typescript
// app/web-vitals.ts
'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // GA4にカスタムイベント送信
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_rating: metric.rating,
      });
    }
  });
  return null;
}
```

### Cloudflare Pagesでの注意点

- **重要な変更（2025年12月）**：CloudflareはNext.jsの推奨デプロイ先を **Cloudflare Pages → Cloudflare Workers + OpenNext** に変更([thetombomb.com](https://www.thetombomb.com/posts/nextjs-pages-cloudflare-pages))。Pagesは技術的には動作するがNext.jsのフル機能をサポートしない（Edge runtime限定、画像最適化制限あり）。
- **本プロジェクトはSSGなので大きな問題なし**：`output: 'export'` で完全静的化すれば、Cloudflare Pagesで問題なく動作。
- ただし将来ISR/SSRが必要になる場合は `@opennextjs/cloudflare` への移行を視野に入れる。

```typescript
// next.config.ts (SSG完全静的化)
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true }, // CloudflareでNext.js Imageが使えないため
};
export default nextConfig;
```

### やってはいけないこと

- ❌ 計算機の `onChange` で同期的にDOM全体を再描画
- ❌ 大きな JSライブラリを計算機ページに同梱（lodash全体importなど）
- ❌ AdSenseタグを `<body>`末尾に何の領域予約もせず差し込む（CLS悪化）
- ❌ Above the foldに `next/image` で大きな画像をlazy load（LCP悪化）
- ❌ `useState` 1つで巨大なオブジェクトを管理（毎入力で全reactComponentが再レンダー）

---

## 8. OGP/Twitter Cards画像の生成

### 原則

- **OGPサイズの標準**：1200×630px（アスペクト比 1.91:1）。Twitterの`summary_large_image` も同サイズで対応。
- ファイルサイズ上限：OG画像 8MB / Twitter画像 5MB([Next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image))。
- **CTR向上要素**：(1) ページタイトルの大きな表示、(2) 計算機名、(3) ブランドロゴ、(4) コントラスト強い背景、(5) 「無料」「即計算」などのCTA語。
- **Next.js 15の`opengraph-image.tsx`がベストプラクティス**：ビルド時に各ページ用の画像を自動生成。

### コード例：動的OG画像生成（計算機ページごと）

```typescript
// app/c/[category]/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getCalculatorBySlug } from '@/lib/calculators';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = '計算屋 計算機';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ category: string; slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const c = await getCalculatorBySlug(slug);

  // 日本語フォントの読み込み（必須：ImageResponseはCJKフォントを内蔵していない）
  const notoFontData = await readFile(
    join(process.cwd(), 'assets/NotoSansJP-Bold.ttf')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '80px',
          fontFamily: 'Noto Sans JP',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.7 }}>計算屋</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.2 }}>
            {c?.name ?? '計算機'}
          </div>
          <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85 }}>
            {c?.shortBenefit ?? ''}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            fontSize: 28,
          }}
        >
          <div style={{ background: '#22c55e', padding: '8px 24px', borderRadius: 999 }}>
            無料
          </div>
          <div style={{ opacity: 0.8 }}>登録不要・即計算</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans JP', data: notoFontData, style: 'normal', weight: 700 },
      ],
    }
  );
}
```

**Next.jsが自動で生成するメタタグ**：
```html
<meta property="og:image" content="<auto-generated-url>" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="<auto-generated-url>" />
```

`twitter-image.tsx` を別途作る必要があれば同じパターンで配置。

### OG画像のalt文設定

`opengraph-image.alt.txt` を同じディレクトリに置くと自動的にalt属性に反映される。

### やってはいけないこと

- ❌ 全ページで同一の固定OG画像（PSEOで30本同じ画像はテンプレ感が出る）
- ❌ 画像内の文字が小さすぎる（Twitterモバイルで読めない）
- ❌ Cloudflareでimage optimizationを使うつもりで `next/image` の`unoptimized: false` のまま（SSGで動かない）
- ❌ CJKフォント未指定で日本語が「□□□」表示

---

## 9. sitemap.xml と robots.txt の設計

### 原則

- **1サイトマップ最大50,000 URL / 50MB**（圧縮前）([Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap))。30本程度なら1ファイルで十分。
- **`<priority>` `<changefreq>` はGoogleに無視される**（公式表明済み）([Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap))。`<lastmod>`のみ意味があり、**ページ実体の最終更新日と一致**している場合のみ参照される。
- **大規模化したらsitemap index**で分割。

### 実装パターン（Next.js 15のapp/sitemap.ts）

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllCalculators, getAllCategories } from '@/lib/calculators';

const BASE = 'https://keisanya.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const calculators = await getAllCalculators();
  const categories = await getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date('2026-04-25') },
    { url: `${BASE}/about`, lastModified: new Date('2026-04-01') },
    { url: `${BASE}/about/operator`, lastModified: new Date('2026-04-01') },
    { url: `${BASE}/privacy`, lastModified: new Date('2026-01-01') },
    { url: `${BASE}/disclaimer`, lastModified: new Date('2026-01-01') },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/c/${cat.slug}`,
    lastModified: new Date(cat.updatedAt),
  }));

  const calculatorPages: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${BASE}/c/${c.category}/${c.slug}`,
    lastModified: new Date(c.updatedAt), // **ページ実体の最終更新日を厳格に**
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages];
}
```

**重要**：`lastModified` は**コンテンツが本当に変わったときだけ更新**する。「sitemap生成日時」を入れるとGoogleが信頼しなくなる([Search Engine Journal](https://www.searchenginejournal.com/technical-seo/xml-sitemaps/))。

### robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      // AI bots: ポリシー次第で許可/拒否
      // { userAgent: 'GPTBot', disallow: '/' }, // ← 拒否したい場合のみ
    ],
    sitemap: 'https://keisanya.com/sitemap.xml',
    host: 'https://keisanya.com',
  };
}
```

### Search Console送信のタイミング

- 初回デプロイ後に **Search Console > サイトマップ > 新しいサイトマップを追加** で `/sitemap.xml` を送信。
- 以降は自動的に再クロールされる（明示的な再送信は不要）。
- 大量更新時のみ、**URL検査ツールで主要ページを「インデックス登録をリクエスト」**。1日10〜12件まで。

### やってはいけないこと

- ❌ noindex設定したページをsitemapに含める（混乱信号）
- ❌ `<priority>1.0`を全ページに付ける（無視されるしジャッジが上がるわけではない）
- ❌ canonical違いのURL（`/c/bmi` と `/c/bmi/`）を両方含める
- ❌ `<lastmod>` を毎ビルドで現在時刻に更新（Googleの信頼を失う）

---

## 10. AI Overviews / SGE対策（2026年最新）

### 現状認識

- **AI Overviewsは50%以上のクエリで表示**([thedigitalbloom.com](https://thedigitalbloom.com/learn/google-ai-overviews-top-cited-domains-2025/))。Seer Interactiveの2025年9月調査では、AI Overviews表示クエリのオーガニックCTRは**1.76%→0.61%（-61%）**に低下([seerinteractive.com](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update))。
- **ただしAI Overviewsに引用されたページは未引用ページに対して+35%のオーガニッククリック**を獲得([seerinteractive.com](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update))。引用されることが新しいKPI。
- 2026年1月、AI Overviewsは Gemini 3 にアップグレードされ、**fan-out queries**（メインクエリを複数のサブクエリに分解する手法）が引用判断の主要ロジックに([Search Engine Journal](https://www.searchenginejournal.com/google-ai-overview-citations-from-top-ranking-pages-drop-sharply/568637/))。**top10ランキングと引用率の相関が17〜38%まで低下**。

### AI Overviewsに引用される条件

CXLが100件のAI Overview引用を分析した結果、**引用snippet の55%はページ上位30%エリアから抽出**され、25%は中盤、20%が下部([CXL](https://cxl.com/blog/google-ai-overview-citation-sources/))。

実装上の対策：

#### 10.1 Answer-First構造

```markdown
# 電気代シミュレーター

【1〜2文の核心定義】電気代シミュレーターは、契約アンペアと月間使用量(kWh)から、
燃料費調整額・再エネ賦課金を含む月額の電気料金を即座に試算するツールです。

[計算機UI]

## 計算結果の見方
[最初の段落で結果の意味を完結に説明]
```

最初の150〜200語は「定義 + 核心の答え」を完結に。前置き・問題提起・物語化はAI引用を阻害する。

#### 10.2 FAQをAI引用ターゲットとして書く

各Q&Aは独立して読めること、最初の1文で答えが完結すること：

```markdown
**Q: 電気代の燃料費調整額とは？**
A: 燃料費調整額とは、原油・LNG等の燃料価格変動を電気料金に反映する仕組みで、
毎月kWhあたりの単価が変動します。2026年4月時点の単価は…
```

#### 10.3 引用元としての権威性シグナル

Surferの2025年調査で、AI Overviewsが最も引用するドメインはYouTube(23.3%)、Wikipedia(18.4%)、Google.com(16.4%)([surferseo.com](https://surferseo.com/blog/ai-citation-report/))。中小サイトが食い込むには：
- **First-party data**（独自に集計したデータ、計算事例）
- **明確な著者+credentials**
- **Schemaの完備**（FAQPage、Article、Person、Organization）
- **更新頻度の維持**（85%の引用は過去2年以内に発行されたコンテンツ）

#### 10.4 計算機ページがAIに置き換えられない価値

「計算式自体はAI Overviewsで答えられても、**実際にユーザーが入力して結果を得るインタラクティブ体験**はAIで代替不可」。これがPSEO計算機サイトの最大の防衛戦略。

→ AI Overviews向けには「定義・式」を簡潔に、計算機本体への遷移を促す導線を強化。

### コード上の実装ポイント

- 各ページのH1直後に「核心定義」をH2なしで配置（first 150 wordsをそのままAI引用に）
- FAQPage schemaを必ず付ける（AI Overviewsが引用シグナルとして使う）
- ページ更新時は `dateModified` を本当に意味のある変更時のみ更新

### やってはいけないこと

- ❌ ストーリーテリングで導入：「皆さんも電気代に悩んだことありませんか？…」
- ❌ 結論を最後に置く（AI Overviewsはページ下部を読まない）
- ❌ AI生成テキストをそのまま貼る（質低下→引用されない悪循環）

---

## 11. Scaled Content Abuseペナルティ回避

### 原則：2024-2025年の取り締まり履歴

| 時期 | アップデート | 影響 |
|---|---|---|
| 2024.03 | Core Update + 3つの新スパムポリシー | 低品質コンテンツ45%削減([Google](https://blog.google/products-and-platforms/products/search/google-search-update-march-2024/)) |
| 2024.05.05 | Site reputation abuseのenforcement開始 | 大手メディアの「coupon」「shopping」セクションが激減 |
| 2024.11 | Site reputation abuseポリシー更新 | first-party oversightの抜け道を塞ぐ([Google](https://developers.google.com/search/blog/2024/11/site-reputation-abuse)) |
| 2025.02 | Algorithm Update | Quality Rater Guidelinesが11ページ追加 |
| 2025.03 | Core Update | YMYL系で89%トラフィック減の事例も |
| 2025.06 | Core Update | Spam filteringの精度向上 |
| 2025.08.26 | Spam Update | programmatic/thin contentが追加で取り締まり対象 |
| 2025.12 | Core Update | YMYL系の67%が visibility loss |

### Googleのscaled content abuse判定ロジック

**Firefly**（QualityCopiaFireflySiteSignal）と呼ばれる site-level signal が運用中とされる([hobo-web.co.uk](https://www.hobo-web.co.uk/firefly/))。判定要素：
- ページ生成のvelocity（短期間に数千ページ→警戒）
- 全ページのテンプレート流用率
- 各ページの ユーザーエンゲージメント（CTR、滞在時間、bounce）
- オリジナルコンテンツの量

### PSEOで生き残るサイトの条件

1. **Unique Data Layer**：他では手に入らないデータを各ページに搭載
   - 計算機の場合：**計算結果に応じた動的な解釈テキスト**、結果範囲別の対処法、業界統計の埋め込み
2. **30〜40%の差別化率**：同カテゴリ内でテンプレート部分が60〜70%まで、各ページ独自要素30〜40%以上
3. **手動でのレビュー**：30本程度なら全ページを人間がチェック
4. **エンゲージメント監視**：直帰率90%以上のページは即座に改善 or noindex
5. **Editorial governance**：運営者・監修者が明確、各記事に署名

### 「独自データレイヤー」の具体実装パターン

例：電気代シミュレーター
- **計算機本体**（共通テンプレ可）
- **入力例：契約アンペア別の典型的な家族構成**（独自データ）
- **比較データ：地域別電気料金の月間推移2024-2026年**（独自集計）
- **削減シミュレーション：ピーク時間帯シフトによる平均削減額**（独自分析）
- **関連法規：託送料金改定の最新動向**（独自リサーチ）
- **FAQ：実ユーザーの質問から作成**（外部Q&Aサイト等を分析）

これらをすべて埋めて初めて「scaled abuse でないPSEO」になる。

### 大量ページのインデックス管理

```typescript
// 公開前のpages, draft等は確実にnoindex
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// または page.tsx で動的に
if (!c.published) {
  return { robots: { index: false } };
}
```

`generateStaticParams` で `dynamicParams = false` にすれば、未知のslugは404を返す（無駄なURLを生成しない）。

### やってはいけないこと

- ❌ AI生成テキストをノーチェックで全30本に投入
- ❌ 計算機ロジック以外がほぼ同じテンプレートのみのページ
- ❌ 「[都道府県] [計算機名]」のような地域×計算機の機械的な組み合わせ大量生成
- ❌ アフィリエイト目的だけの「ベスト〜」ページを混ぜる（site reputation abuseリスク）
- ❌ サイトが伸びないからといってドメインを買い替えて同じ内容を移植（expired domain abuseに認定されうる）

---

## 12. YMYL対応

### 原則

- **YMYL（Your Money or Your Life）領域**：金融、医療、法律、安全に関するページは、不正確な情報がユーザーの健康・財産・幸福に重大な影響を与えうる、とGoogleが定義(([Google QRG Section 2.3](https://intercore.net/eeat-ymyl-for-law-firms/))。
- **計算機サイトでYMYLに該当するもの**：
  - 金融：ローン計算、投資シミュレーター、税金計算、年金、保険
  - 医療：BMI、カロリー、薬剤量計算、妊娠週数
  - 法律：相続、慰謝料、過払い金
- **YMYL E-E-A-T要件は通常コンテンツより厳格**([Google QRG Section 3.4](https://surferseo.com/blog/eeat-in-ymyl/))：「formal expertise is important for YMYL topics such as legal advice」（Google公式）。

### 実装すべきE-E-A-T要素

#### 12.1 監修者制度

```tsx
// components/Reviewer.tsx
export function ReviewerBadge({ reviewer }: { reviewer: Reviewer }) {
  return (
    <div className="border rounded p-4">
      <div className="flex items-center gap-3">
        <img src={reviewer.photo} alt={reviewer.name} className="w-12 h-12 rounded-full" />
        <div>
          <div className="text-sm">監修者</div>
          <Link href={`/reviewers/${reviewer.slug}`}>
            <strong>{reviewer.name}</strong>（{reviewer.credential}）
          </Link>
        </div>
      </div>
      <p className="text-sm mt-2">{reviewer.bio}</p>
      <div className="text-xs mt-1">最終確認日: {reviewer.lastReviewedAt}</div>
    </div>
  );
}
```

監修者ページはPerson schemaで構造化（Author Schema 2025標準）：

```typescript
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://keisanya.com/reviewers/yamada-taro#person",
  "name": "山田太郎",
  "jobTitle": "ファイナンシャルプランナー（CFP®）",
  "description": "金融機関20年勤務後、独立系FPとして…",
  "image": "https://keisanya.com/reviewers/yamada-taro.jpg",
  "url": "https://keisanya.com/reviewers/yamada-taro",
  "sameAs": [
    "https://www.linkedin.com/in/yamadataro",
    "https://twitter.com/yamadataro"
  ],
  "worksFor": { "@id": "https://keisanya.com/#org" }
}
```

そしてArticle/CalculatorページでこのPersonを参照：

```typescript
{
  "@type": "Article",
  "author": { "@id": "https://keisanya.com/authors/writer-a#person" },
  "reviewedBy": { "@id": "https://keisanya.com/reviewers/yamada-taro#person" }
}
```

#### 12.2 運営者情報ページ（必須）

`/about/operator` に：
- 運営会社名・所在地・代表者名
- 連絡先（メールフォーム）
- 編集方針・誤情報訂正ポリシー
- ファクトチェックプロセス
- 利益相反の開示（アフィリエイト/AdSenseの存在）

#### 12.3 免責事項の配置

YMYL計算機の場合、計算結果セクション直下に明示：

```tsx
<aside className="border-l-4 border-amber-400 bg-amber-50 p-4 my-6">
  <p className="text-sm">
    <strong>免責事項：</strong>本シミュレーターの計算結果は概算であり、
    実際の{c.disclaimerSubject}には法令・契約条件・市場状況により差異が生じます。
    重要な意思決定の前に、{c.recommendedAdvisor}へご相談ください。
  </p>
</aside>
```

**SEO影響**：免責事項を本文末ではなく結果直下に置くことで、ユーザーへのtrust signalが高まり、YMYL評価でプラスに働く（Search Quality Rater Guidelinesの「medical disclaimer」推奨と同じ思想）。

#### 12.4 YMYLキーワードの見分け方

以下が含まれていればほぼYMYL：
- 金額・税金・利息・年金・保険・投資・相続
- 病気名・薬名・症状・カロリー（極端な減量目的）
- 法律名・慰謝料・損害賠償・契約

YMYL判定されたら：
- 監修者必須
- 出典リンク必須（公式機関・査読論文）
- 更新頻度を上げる（最低四半期に1度のレビュー）

### やってはいけないこと

- ❌ 著者名「Admin」「編集部」のままYMYLページを公開
- ❌ 免責事項をfooterに小さく入れて満足
- ❌ 医療系で「○○すれば確実に治る」「○○gで完全に痩せる」のような断定
- ❌ 監修者名は表示するが、その人のbio・credentialへのリンクが無い
- ❌ 出典として個人ブログ・他SEO記事のみを引用

---

## 13. Search Console / Bing Webmaster Tools の活用

### 13.1 Google Search Console

#### 必ず行う初期設定

1. プロパティ追加（**ドメインプロパティ**を推奨。サブドメイン・プロトコル全部カバー）
2. サイトマップ送信（`/sitemap.xml`）
3. URL検査ツールで主要ページの「URLがGoogleに登録されています」を確認
4. **Coverageレポート**を週次でチェック（Indexedの増減、Excludedの理由）

#### URL検査ツールの実用テクニック

- **ライブテスト**：修正直後にrender確認。JavaScriptで生成される計算機UIが正しくrenderされているか（GoogleはJSをrenderするが、複雑なクライアントSPAは取りこぼしがある）。
- **構造化データ確認**：`Page indexing > Enhancements` でJSON-LD読み取り結果が出る。schema検証の補助。
- **リクエスト**：1日10-12件まで。新規公開ページや重要更新時のみ([Search Engine Land](https://searchengineland.com/google-search-console-url-inspection-tool-seo-use-cases-457462))。
- **Discovery情報**：どのsitemap・どのreferring pageからGoogleがURLを発見したかが分かる。内部リンクの効果検証に使える。

#### クエリレポートの活用

`Performance > Search results` で各ページのクエリ別CTR・position・impressionsを確認：
- **CTR < 2% かつ position 1-10**のクエリ：title/descriptionの問題。書き換え対象。
- **position 11-20**のクエリ：あと一押し。内部リンク追加・コンテンツ拡充候補。
- **impressions急減**のページ：core update影響かE-E-A-T不足の疑い。

### 13.2 Bing Webmaster Tools + IndexNow

Bingの戦略的価値が2025年に大幅上昇：**ChatGPT-4はBingのSearch Indexにアクセスする**ため、Bing対策がそのままChatGPT visibility対策になる([webfeatcomplete.com](https://webfeatcomplete.com/indexnow-easy-setup-bing-wmt/))。

#### IndexNow APIの実装

```typescript
// scripts/notify-indexnow.ts
const INDEXNOW_KEY = process.env.INDEXNOW_KEY!; // 例: 8A7B3F2D9E1C4567...
const HOST = 'keisanya.com';

export async function notifyIndexNow(urls: string[]) {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  return res.status === 200 || res.status === 202;
}

// 使い方: ビルド完了後・コンテンツ更新時に呼ぶ
await notifyIndexNow([
  `https://${HOST}/c/finance/loan-prepayment`,
  `https://${HOST}/c/finance/electricity-bill`,
]);
```

セットアップ：
1. Bing Webmaster Tools → IndexNow → API キー生成
2. `public/[KEY].txt` にキーをそのまま記述したテキストファイルを配置
3. ビルド完了後にcron / GitHub Actions で `notifyIndexNow()` を発火

IndexNowはBing/Yandex/Naver等が共同運用。GoogleはAPI不参加だが、**Cloudflareの「Crawler Hints」を有効にすればCloudflareが代行通知**してくれる(Bingの推奨設定)([bing.com](https://www.bing.com/indexnow/getstarted))。Cloudflare Pagesユーザーは特にメリット大。

### やってはいけないこと

- ❌ 「URLがGoogleに登録されています」を見て安心して終わる（実検索で順位を確認しないと意味なし）
- ❌ URL inspectionで毎日「インデックス登録をリクエスト」連打（ranking改善には繋がらない）
- ❌ Bing Webmaster Toolsを無視（ChatGPT流入の機会損失）
- ❌ IndexNowのキーをハードコード（環境変数化）

---

## 14. 計算機ページ特有のSEO戦術

### 14.1 計算結果ページの動的化：クエリパラメータ vs 静的ルート

**結論：「入力画面（インデックス対象）」と「結果画面（インデックス対象外）」を明確に分ける**。

| 方式 | URL例 | インデックス | 共有可能 | 推奨用途 |
|---|---|---|---|---|
| **静的計算機ページ** | `/c/finance/loan-prepayment` | ✅ | ✅ | メインのSEO target |
| **クエリパラ結果** | `/c/finance/loan-prepayment?p=3000&r=1.2&y=20` | ❌（noindex推奨） | ✅ | パーマリンク共有用 |
| **静的結果ページ** | `/c/finance/loan-prepayment/result/3000-1.2-20` | ❌ | ✅ | 高頻度入力パターンのみ |

クエリパラメータ結果ページは **client-sideで結果を即時計算**し、`<link rel="canonical">` で親ページを指す：

```tsx
// app/c/[category]/[slug]/page.tsx
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const c = await getCalculatorBySlug(slug);

  return (
    <>
      <head>
        {/* 結果URLでもcanonicalは入力画面 */}
        <link rel="canonical" href={`https://keisanya.com/c/${c.category}/${slug}`} />
      </head>
      <CalculatorWidget config={c.config} initialInput={sp} />
    </>
  );
}
```

**理由**：何千通りもの計算結果URLを全部インデックスさせると `scaled content abuse` リスク。Googleはパラメータ違いのほぼ同一URLを重複コンテンツとみなす([Search Engine Journal](https://www.searchenginejournal.com/technical-seo/url-parameter-handling/))。

### 14.2 計算機UIをGoogleにクロールさせるコツ

GoogleはJavaScriptをrenderするが、以下のリスクあり：
- 入力フィールドが`<input>`タグでない（`<div role="textbox">`など）→読み取れない
- 計算結果がイベント駆動でしか出ない→Googlebotには空に見える

**対策**：
1. 入力UIは標準HTML elementを使う（`<input type="number">`等）
2. **デフォルト計算結果をSSGで静的に埋め込む**：

```tsx
export default async function Page({ params }: Props) {
  const c = await getCalculatorBySlug((await params).slug);
  const sampleResult = calculate(c.sampleInput); // ビルド時に計算

  return (
    <>
      <CalculatorWidget config={c.config} initialInput={c.sampleInput} />
      {/* ↓ ビルド時にSSG済み。Googlebotがすぐ読める */}
      <section>
        <h2>計算例</h2>
        <p>
          {c.sampleInputDescription}の場合、計算結果は<strong>{sampleResult.formatted}</strong>になります。
          {sampleResult.interpretation}
        </p>
      </section>
    </>
  );
}
```

これによりGoogleは「このページはこういう入力でこういう計算結果を返す」と確実に理解できる。

### 14.3 計算結果に応じた動的FAQ生成

入力値の範囲別に異なるFAQを表示することで、ロングテールの検索意図を捉える：

```tsx
// 例: BMI計算機
function getDynamicFAQs(bmi: number, c: Calculator) {
  if (bmi < 18.5) return c.faqsForUnderweight;
  if (bmi < 25) return c.faqsForNormal;
  if (bmi < 30) return c.faqsForOverweight;
  return c.faqsForObese;
}
```

ただしFAQPage schemaに含めるのは**SSGでデフォルト表示するもののみ**（ユーザー入力後にJSで切り替わるFAQをschemaに入れるとGoogleとの不一致になる）。

### 14.4 共有可能なURL（パーマリンク）の設計

```tsx
// 計算結果に「URLをコピー」ボタン
function shareUrl(calculatorSlug: string, input: Record<string, any>) {
  const params = new URLSearchParams(
    Object.entries(input).map(([k, v]) => [k, String(v)])
  );
  return `https://keisanya.com/c/${calculatorSlug}?${params}`;
}
```

このURLはnoindexされているがユーザー間で共有可能 → ブランド認知向上。SNSシェアからの被リンク増加効果も。

### やってはいけないこと

- ❌ 計算結果URLをインデックスさせる（数千ページの薄いコンテンツ量産→penalty）
- ❌ JavaScript無しでは何も表示されない計算機（SSG済みの説明文すら無い）
- ❌ 結果ページに `<title>` を毎回動的に変える（重複コンテンツ判定）
- ❌ 入力URLにセッションIDなどを含める（クロール無駄遣い）

---

## 15. 日本語SEO特有の注意点

### 15.1 ひらがな/カタカナ/漢字の表記揺れ

**Googleは表記揺れの理解度を上げているが、まだ完全ではない**([web-planners.net](https://www.web-planners.net/blog/archives/000192.html))。例：
- 「鞄」「カバン」「かばん」→Googleは同義として扱う事が多い
- 「フコイダン」「フコダイン」→Googleは別物扱い（打ち間違いパターン）

**実装ルール**：
1. **タイトル・H1・URLは1つの表記に統一**：検索ボリュームが最も多いものを選ぶ（Google Trendsで確認）
2. **本文中で2割程度は表記揺れバージョンも記述**：「電気代（電気料金とも呼ばれる）」のように自然に挿入
3. **Meta Descriptionでもう1つの表記をカバー**：タイトルが「電気代シミュレーター」ならDescriptionで「電気料金の計算」と書く([s-yqual.com](https://s-yqual.com/blog/803))
4. **メタkeywordsタグは使わない**（Googleは無視。古い情報源で「使え」と書いてあっても無視）

### 15.2 ローマ字表記KW（keisan vs 計算）

ローマ字検索は**極めて少数派**。Google Trendsで `bmi keisan` と `BMI 計算` を比較すると、後者が10〜100倍のボリューム。

例外：
- 固有名詞・人名・地名（Googleは英語表記とローマ字表記を翻訳して同義扱い）
- 海外ユーザー（在日外国人）向けターゲット

**結論**：URLはローマ字、コンテンツとKWターゲットは日本語を主軸に。

### 15.3 助詞を含むKW

ロングテールKWでは助詞を含むものが多い：
- 「電気代 計算 アンペア」（複合語）
- 「電気代を安くする方法」（助詞含み）
- 「電気代 高い 原因」（疑問形）

H2/H3に**自然な日本語の疑問形**を含めると、AI Overviews引用ターゲットになりやすい：
- ✅ `H2: 電気代を安くするにはどうすればよいですか？`
- ❌ `H2: 電気代節約方法` （短すぎてAI引用に向かない）

### 15.4 Yahoo!検索（Bing系）への影響

Yahoo!Japan検索エンジンの内部はGoogleエンジン（Google Sponsored Search）と Microsoft Bingの両方をテストしている時期があったが、2025年現在は**Yahoo!JapanはGoogleとは別のアルゴリズムも併用**。実用上：
- Google対策していればYahoo!Japanでも概ねランクする
- ただし**Bing Webmaster Tools への登録は必須**（IndexNow対応も含めてChatGPT visibilityにつながる）
- Yahoo!Japan独自に伝統的なシグナルを重視（被リンク、運営年数等）が残るとされる

### やってはいけないこと

- ❌ 1ページ内で「電気代」と「電気料金」を交互に使い続ける（一貫性無し→読みにくい）
- ❌ KWスタッフィング目的で全表記揺れを羅列：「電気代 / 電気料金 / 電力料金 / 電気料」
- ❌ ローマ字での無理なKWターゲティング：「denkidai keisan」をtitleに入れる
- ❌ Yahoo!Japanを完全無視（日本市場では依然20%程度のシェア）

---

## 16. 計算機ページ実装のチェックリスト（最終版）

### ページ公開前に確認すべき30項目

#### Title & Meta（5項目）
- [ ] Titleは32文字以内（日本語全角換算）
- [ ] Title冒頭に主要KWを配置
- [ ] ブランド名はTitle末尾
- [ ] Descriptionは120〜140文字
- [ ] Description前方80文字に最重要メッセージ

#### Heading & Content（7項目）
- [ ] H1は1つのみ、Titleと意味的に一致
- [ ] H1直後に「核心定義」150〜200字（AI引用target）
- [ ] H2「計算結果の見方」「使い方」「計算式・根拠」「FAQ」を網羅
- [ ] 解説本文は500語以上、テンプレ流用率30%以下
- [ ] 計算機UIだけでなく必ず文章解説あり
- [ ] FAQは5〜8件、独立したQ&A形式
- [ ] 監修者表記（YMYLは必須）

#### Schema（5項目）
- [ ] WebApplication or SoftwareApplication
- [ ] BreadcrumbList（visible breadcrumbと完全一致）
- [ ] FAQPage（visible FAQと完全一致）
- [ ] Organization（ルートで1度）
- [ ] Rich Results Testで全schemaがpass

#### URL & Routing（3項目）
- [ ] URLは小文字・ハイフン区切り・ローマ字
- [ ] canonicalタグが設定済み（クエリパラメータ含むURLでも親URLを指す）
- [ ] パンくずがJSON-LDと視覚UIで一致

#### Performance（5項目）
- [ ] LCP < 2.5s（PageSpeed Insightsで実測）
- [ ] INP ≤ 200ms（実機操作で確認）
- [ ] CLS < 0.1
- [ ] AdSense枠は領域予約済み（CLS悪化防止）
- [ ] OG画像 1200×630px、CJKフォント設定済み

#### 内部リンク（3項目）
- [ ] 関連計算機 3〜5本
- [ ] 上位ハブ（カテゴリページ）への戻りリンク
- [ ] 内部リンク総数 10〜15本（ナビ除く）

#### YMYL/E-E-A-T（2項目）
- [ ] 著者・監修者ページが存在し、Person schemaで構造化
- [ ] 免責事項が結果セクション直下に明示

### 公開直後（24時間以内）

- [ ] Search ConsoleのURL検査で「インデックス登録をリクエスト」
- [ ] IndexNow APIで通知
- [ ] Twitter Card Validator / Facebook Sharing DebuggerでOG確認
- [ ] sitemap.xmlに新URLが含まれていることを確認

### 公開後1週間〜1ヶ月

- [ ] Search Console Performanceで impressions発生を確認
- [ ] 想定外のクエリで表示されていないか確認
- [ ] CTR < 2% かつ表示順位上位ならtitle改善
- [ ] AI Overviewsに引用されているか手動チェック（主要クエリで）

---

## 17. 落とし穴：これを変えるとSEO効果が落ちる

| 変更内容 | 影響 | 復旧難度 |
|---|---|---|
| URLスラッグの変更（リダイレクト設定なし） | 全PageRankリセット | 高（301で部分回復） |
| canonicalタグの誤設定（別ページを指す） | インデックスから消える | 中 |
| H1の文言を頻繁に変更 | Googleがページ主題を見失う | 低 |
| 監修者を消す（YMYLページ） | Quality drop、core update被害 | 中 |
| sitemapから消す | クロール頻度低下 | 低 |
| 大量ページを一気に追加（30→300本） | scaled content abuse判定リスク | **高** |
| 計算機UIを完全クライアントレンダリング化 | コンテンツ空判定、ranking drop | 中 |
| FAQ schemaのQ&Aがvisible FAQと不一致 | rich result剥奪 | 低 |
| 「2026年最新」を古いまま放置 | 信頼性低下、AI引用減 | 低 |
| メタkeywordsタグに頼る | 効果ゼロ（時間の無駄） | - |
| Cloudflare Pagesで`output: 'export'`なしにNext.js 15を使う | ビルド失敗 or runtime制限 | 中 |
| 内部リンクアンカーを全部「こちら」 | コンテキスト不明、ranking希薄化 | 低 |
| Description全ページ同一テンプレ | snippet書き換え増加、CTR低下 | 低 |
| AdSense審査前にAI生成テキストのみ投入 | AdSense審査落ち | 高 |

---

## 18. AdSense審査と両立させる実装のコツ

### AdSense 2025-2026年の審査観点

公式([Google AdSense Help](https://support.google.com/adsense/answer/9724?hl=en))および実例分析より：

1. **オリジナル・高品質コンテンツが20-25本以上**（計算機30本＋各500語解説で十分クリア）
2. **HTTPS必須**（Cloudflareで自動取得）
3. **Privacy Policy / About / Contact ページが存在**
4. **18歳以上の運営者**
5. **Better Ads Standardsへの準拠**（強制クリック誘導禁止、過剰なpop-up禁止）
6. **YMYL系は特に厳格にE-E-A-T要件**

### 審査通過しやすい構成

```
ホーム
├─ /c/finance, /c/health, /c/daily（カテゴリハブ）
├─ /c/[category]/[slug] × 30（各計算機ページ、500語+解説）
├─ /about（運営方針、編集ポリシー）
├─ /about/operator（運営者情報、連絡先）
├─ /about/reviewers/[slug]（監修者一覧）
├─ /privacy（プライバシーポリシー、AdSense Cookie言及）
├─ /disclaimer（免責事項、特にYMYL対応）
└─ /contact（問い合わせフォーム）
```

### Privacy Policyに必須記載事項

- AdSenseクッキーの利用
- Google Analyticsの利用
- 第三者ベンダーの情報収集
- ユーザーがCookieをオプトアウトする方法（→ https://adssettings.google.com/）
- アフィリエイトリンクの存在（ある場合）

### AdSense広告の配置ベストプラクティス

```tsx
// 計算機ページの広告配置例
<article>
  <h1>{c.name}</h1>
  <CalculatorWidget />
  <ResultDisplay />

  {/* 広告1: 結果直下（高CTR） */}
  <AdSlot slot="in-content-1" minHeight={280} />

  <section>
    <h2>{c.name}の使い方</h2>
    {/* … */}
  </section>

  {/* 広告2: コンテンツ中盤 */}
  <AdSlot slot="in-content-2" minHeight={280} />

  <FAQSection />
  <RelatedCalculators />
</article>
```

**Better Ads Standardsを守る**：
- Above the foldに大きな広告を置かない（「ad-heavy」判定）
- 計算機UIの直前直後に広告は置かない（誤クリック誘導とみなされる）
- 広告とコンテンツの境界を明確に（`広告` ラベル）

---

## 付録A：参考した一次情報源（信頼性ランキング順）

### 公式・一次情報
- Google Search Central Documentation: https://developers.google.com/search
- Google Search Central Blog: https://developers.google.com/search/blog
- Google AdSense Help: https://support.google.com/adsense
- Schema.org公式: https://schema.org/
- Web.dev (Core Web Vitals): https://web.dev/articles/inp
- Bing Webmaster Tools / IndexNow: https://www.bing.com/indexnow
- Next.js公式ドキュメント: https://nextjs.org/docs
- Cloudflare Pages / Workers / OpenNext: https://opennext.js.org/cloudflare

### 二次情報（信頼度高）
- Search Engine Land: 特に[Google changed 76% of title tags in Q1 2025](https://searchengineland.com/google-changed-76-of-title-tags-in-q1-2025-heres-what-that-means-454847), [URL Inspection Tool 7 cases](https://searchengineland.com/google-search-console-url-inspection-tool-seo-use-cases-457462), [Programmatic SEO guide](https://searchengineland.com/guide/programmatic-seo)
- Search Engine Journal: 特に[Spam policies updates](https://www.searchenginejournal.com/in-depth-look-at-google-spam-policies-updates/), [URL parameter handling](https://www.searchenginejournal.com/technical-seo/url-parameter-handling/)
- Backlinko: [Pillar Pages](https://backlinko.com/pillar-pages)
- Seer Interactive: [AIO Impact on CTR](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update)
- CXL: [AI Overview citation analysis](https://cxl.com/blog/google-ai-overview-citation-sources/)
- Surfer: [AI Citation Report 2025](https://surferseo.com/blog/ai-citation-report/)

### PSEO実例・事例
- Zapier $140M ARR with 70K pages: [guptadeepak.com](https://guptadeepak.com/the-programmatic-seo-paradox-why-your-fear-of-creating-thousands-of-pages-is-both-valid-and-obsolete/)
- Programmatic SEO traffic cliff prevention: [getpassionfruit.com](https://www.getpassionfruit.com/blog/programmatic-seo-traffic-cliff-guide)
- Common pSEO mistakes: [seomatic.ai](https://seomatic.ai/blog/programmatic-seo-mistakes)

### 日本語SEO参考
- 海外SEO情報ブログ系（Web-planners、edamamejapan）: [edamamejapan.com](https://edamamejapan.com/japan-seo/)
- 日本語URL/表記揺れ: [wpic.co](https://wpic.co/blog/mastering-japanese-seo-10-key-strategies/), [s-yqual.com](https://s-yqual.com/blog/803)
- Mailmate Japanese SEO: [mailmate.jp](https://mailmate.jp/blog/japanese-seo)

---

## 付録B：「絶対やる」TL;DR（実装優先度順）

### Day 1 優先度MUST（公開不可項目）
1. 各計算機ページに `WebApplication` + `BreadcrumbList` JSON-LDを実装
2. Title 32文字以内、KW前方、ブランド末尾
3. URL: ローマ字小文字ハイフン、`/c/[category]/[slug]` 構造
4. canonical タグ設定
5. metadataBase設定、`output: 'export'`でCloudflare Pages対応
6. sitemap.xml + robots.txt
7. Search Console & Bing Webmaster Tools 登録
8. Privacy / About / Operator / Disclaimer ページ作成

### Day 2 SHOULD（SEO効果に直結）
9. 各ページ500語以上の独自解説（テンプレ流用30%以下）
10. FAQPage schema（visible FAQと一致）
11. Organization + Person schemaで運営者・監修者を構造化
12. opengraph-image.tsxで動的OG画像（CJKフォント設定）
13. Core Web Vitals最適化（INP特に重視、useDeferredValue / useTransition）
14. 関連計算機の内部リンク 3〜5本
15. IndexNow API設定

### Day 3 NICE TO HAVE（差別化要素）
16. 計算結果に応じた動的解釈テキスト（独自データレイヤー）
17. 入力範囲別FAQ
18. 「URLをコピー」共有機能（パーマリンク）
19. 監修プロセスの明文化ページ
20. AI Overviewsに引用されやすいAnswer-First構造への全ページ書き換え

---

**本ドキュメントの想定読者**：Claude Code (AI開発エージェント) およびそれを操作する開発者。
**最終更新方針**：Googleのコアアップデート発生時、Next.jsメジャーアップデート時、AdSenseポリシー変更時に都度改訂。
**最終確認日**: 2026年4月25日