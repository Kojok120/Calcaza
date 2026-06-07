# DESIGN.md — alhasiba（keisanya 由来 → AR 用に要再監査）

> ⚠️ **AR 版未監査**: 本書は `keisanya`（日本語）から継承。AR / RTL 用に以下を再監査する必要あり。
> - 日本語の漢字密度・行間・縦組み配慮 → アラビア語の行間・カーニング・連結文字（リガチャー）配慮
> - フォント: `Shippori Mincho` / `Noto Sans JP` → `Tajawal`（display）/ `Noto Sans Arabic`（body）
> - 数字: 半角アラビア数字（コード上）／表示は `Intl` の `ar-SA` で西アラビア数字 0123456789 に統一
> - レイアウト方向: LTR → **RTL（`dir="rtl"`）**。Tailwind の論理プロパティ（`ms-/me-/ps-/pe-/text-start/end`）を使用。物理プロパティ（`ml-/mr-/text-left/right`）は使わない
> - ¥ / JPY → SAR / AED 等 GCC 通貨

---

> **対象スタック**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Cloudflare Pages (SSG)
> **対象ユーザー**: GCC（KSA・UAE 中心）アラビア語 MSA 話者・モバイル中心・検索流入 70%+
> **基盤**: BASE_UI_RULE.md の Calm Design + Strategic Minimalism + Invisible AI に準拠

---

## 0. このドキュメントの位置づけ

`BASE_UI_RULE.md` がプロジェクト横断の UI 憲法、`DESIGN.md`（本書）が 計算屋 固有の補足・トークン定義。両者が衝突した場合は BASE_UI_RULE が優先する。

計算屋 固有の関心事：
- 検索流入ユーザーが「答え」を最短で得るための即時計算
- 日本語の可読性（行間・折返し・漢字密度への配慮）
- 数値表示の整列（tabular-nums）
- AdSense 枠の CLS 対策

---

## 1. デザイン哲学（3原則）

### 原則1：Strategic Minimalism — すべての要素が存在理由を持つ

画面上のすべての要素は、ユーザーを「数字が出る」というゴールに近づけるために存在する。装飾的なグラデーション、不要なアイコン、飾りのイラストは置かない。余白は注意を集中させるための機能。

### 原則2：Invisible AI — AIは透明であること

「AI が試算しました」のようなバッジ・ラベルは付けない。LLM 生成のコピー臭いフレーズ（「3秒で答え」「⚡爆速」など）も排除する。ツール自体が賢く、静かに振る舞う。

### 原則3：Typography-driven Hierarchy — タイポグラフィで導く

色やアイコンに頼らず、文字の大きさ・太さ・濃淡で情報の優先順位を伝える。結果の数値は最も大きく、補足は小さく薄く。

### 計算機サイト固有の追加原則

- **Above-the-fold で結果が見える**：モバイルでも、入力 → 結果のスクロール距離は最小化
- **Reactive Calculation**：入力変更で即時再計算。送信ボタンは置かない
- **AdSense は枠を予約する**：`min-height` で CLS 0.1 未満を維持

---

## 2. カラーシステム

唯一のアクセントは **brand（indigo / 藍）**。orange 等の二次アクセントは使わない。

### 2.1 Tailwind v4 トークン（`app/globals.css` に定義）

OKLCH で知覚的に均等な階調を採用。命名と値は `globals.css` の実装が常に正。

```css
@theme {
  /* Brand (indigo / 藍) — 唯一のアクセント */
  --color-brand-50:  oklch(96% 0.018 250);
  --color-brand-100: oklch(92% 0.035 250);
  --color-brand-500: oklch(58% 0.120 250);  /* 主要ブランド色 */
  --color-brand-600: oklch(48% 0.115 250);  /* hover / 強調 */
  --color-brand-700: oklch(38% 0.100 250);

  /* Semantic — ステータス表示専用、装飾には使わない */
  --color-success-500: oklch(62% 0.140 145);
  --color-warning-500: oklch(72% 0.140 80);
  --color-danger-500:  oklch(58% 0.180 25);

  /* Surface — 画面の90%以上を占める */
  --color-surface-0: oklch(100% 0 0);
  --color-surface-1: oklch(98.5% 0.003 250);
  --color-surface-2: oklch(96.5% 0.005 250);

  /* Ink (text) */
  --color-ink-1: oklch(20% 0.015 250);  /* 本文・見出し */
  --color-ink-2: oklch(40% 0.018 250);  /* 補助 */
  --color-ink-3: oklch(58% 0.014 250);  /* メタ・キャプション */

  /* Border */
  --color-border-subtle:  oklch(94% 0.005 250);
  --color-border-default: oklch(88% 0.008 250);
  --color-border-strong:  oklch(72% 0.014 250);
}
```

### 2.2 運用ルール

- ベース（surface / ink / border）が画面の 90%+ を占める
- brand は CTA・アクティブ状態・フォーカスリング・進捗バーなど「次のアクション or 注目点」にのみ使用
- セマンティックカラーはステータス表示のみ（成功・警告・エラー・情報）。装飾には絶対に使わない
- 色だけで情報を伝えない。テキストラベル or アイコンを併用（WCAG 2.2、色覚多様性配慮）
- 本文と背景のコントラスト比は最低 4.5:1（WCAG AA）

---

## 3. タイポグラフィ

### 3.1 フォント

```css
--font-sans: "Inter var", "Inter", -apple-system, BlinkMacSystemFont,
             "Hiragino Kaku Gothic ProN", "Noto Sans JP", "BIZ UDPGothic",
             system-ui, sans-serif;
--font-numeric: "Inter var", "Inter", "SF Pro Display",
                "Helvetica Neue", Arial, sans-serif;
```

数値は `.tabular` ユーティリティで `font-variant-numeric: tabular-nums lining-nums` を適用し、桁ズレを防ぐ。

### 3.2 タイプスケール

| 用途 | サイズ | ウェイト |
|---|---|---|
| ページタイトル (H1) | 30px / sm:48px | 600 |
| セクション見出し (H2) | 24px / sm:30px | 600 |
| カード見出し (H3) | 18px / 20px | 600 |
| 本文 | 16px | 400 |
| 補助・キャプション | 14px / 12px | 400 |
| 結果数値（強調） | 36px / sm:48px | 600 |

### 3.3 日本語運用ルール

- 本文行間：`--leading-normal: 1.75`
- 見出し行間：`--leading-tight: 1.25`
- `font-feature-settings: "palt" 1` を `html` に適用（プロポーショナル仮名で見栄え調整）
- `word-break: keep-all` + `overflow-wrap: anywhere` で日本語の自然な折返し
- 1行の文字数：日本語 35〜45 文字

---

## 4. スペーシングとレイアウト

8px グリッドを基準に Tailwind 標準スケールを使用。計算屋 固有の追加：`--spacing-14: 3.5rem`（高さ 56px の入力UI 用）。

### ブレークポイント

| ブレークポイント | 幅 | 主用途 |
|---|---|---|
| Mobile | <768px | 完全1カラム |
| Tablet | 768-1023px | 1カラム、サイドバー折りたたみ |
| Desktop | ≥1024px | 計算機は入力/結果の2カラム可 |

コンテンツの最大幅は `max-w-5xl`（1024px）を基準に、本文 prose は `max-w-3xl`。

---

## 5. コンポーネントスタイル

### 5.1 共通ルール（BASE_UI_RULE 由来）

- **box-shadow は使わない**。境界はボーダーで表現
- **角丸は 8px（`rounded-md`）以下**。`rounded-2xl` 以上は禁止
- **ホバー時の変化は控えめに**：背景色の微変化 or ボーダー濃度アップに留める
- **transform 系のホバー（translate, rotate, scale）は使わない**

### 5.2 カード（計算機カード・FAQ・関連リンク）

```
背景:     bg-surface-0 または bg-surface-1
ボーダー: border border-border-default
角丸:     rounded-md (8px)
影:       なし
ホバー:   bg-surface-1 → bg-surface-2 / border → border-strong
```

### 5.3 ボタン

| タイプ | 背景 | テキスト | 用途 |
|---|---|---|---|
| Primary | `bg-ink-1` | `text-surface-0` | メインCTA（黒系） |
| Secondary | `bg-surface-0` + border | `text-ink-1` | 補助 |
| Ghost | 透明 | `text-ink-2` | 控えめ |
| Danger | `bg-danger-500` | white | 破壊的（要確認） |

ボタン高さ：`h-11` (44px、モバイルタッチターゲット最小) / `h-12` 標準 / `h-14` 大。角丸は `rounded-md`。

### 5.4 入力UI（計算機固有）

- `<input type="text" inputmode="decimal" pattern="[0-9.]*">` を使用（`type="number"` は iOS のカンマバグ・ホイール誤操作のため禁止）
- 高さ `h-14` (56px) でタッチ範囲 48×48px 以上を確保
- フォーカス時は `focus:ring-2 focus:ring-brand-500 focus:border-brand-500`
- スライダー＋数値入力の双方向同期（Radix UI Slider）
- 結果はリアルタイム計算（`useDeferredValue` で低優先度更新）

### 5.5 結果カード（ResultStat）

- `bg-surface-1 + border-border-default + rounded-md`、影なし
- 強調値は `text-4xl sm:text-5xl font-semibold text-ink-1 tabular`
- 色で派手にしない。サイズと太字でヒエラルキーを表現
- 補助情報は `text-sm text-ink-2`

### 5.6 進捗バー / 内訳バー

```
背景: bg-surface-3
塗り: bg-brand-500
角丸: rounded-sm（4px）
影:   なし、グラデーション禁止
```

---

## 6. アイコン

### 6.1 ライブラリ

**Lucide Icons (`lucide-react`)** を使用。Linear ストロークスタイル、`strokeWidth={1.5}` を標準とする。

カテゴリアイコンは `lib/icons.ts` に集約：

| カテゴリ | Lucide |
|---|---|
| pet | `PawPrint` |
| finance | `Home` |
| tax | `Receipt` |
| life | `Lightbulb` |
| family | `Backpack` |
| tech | `Cpu` |
| health | `HeartPulse` |

### 6.2 運用ルール

- アイコンは必ずテキストラベルとセットで使用
- サイズ：`h-4 w-4` (16px) / `h-5 w-5` (20px) / `h-6 w-6` (24px)
- カラー：`text-ink-2` 標準、アクティブ時 `text-ink-1`
- **絵文字（🐾🏠⚡など）は装飾用途では使わない**
- **イラスト・装飾画像は置かない**。Empty State はテキスト + アクションボタンで対応

---

## 7. アニメーションとトランジション

### 7.1 基本方針

「存在に気づかないレベル」で使う。状態変化を自然に伝える目的のみ。

| 対象 | duration | easing |
|---|---|---|
| ホバー | 150ms | ease-out |
| 展開・折りたたみ | 200ms | ease-in-out |
| ページ遷移 | 0ms（即時） | — |

### 7.2 数値の更新

結果数値は即時更新（リアルタイム計算）でよい。カウントアップ等の演出は不要。

### 7.3 禁止事項

- バウンス、スプリング等の playful なイージング
- フェードイン / スライドインでの要素出現（即時表示）
- ローディング時のパルスアニメーション
- 装飾的な hover translate / rotate / scale

`prefers-reduced-motion: reduce` は必ず尊重（`globals.css` で全アニメーションを 0.01ms 化）。

---

## 8. やらないことリスト

| やらないこと | 理由 |
|---|---|
| グラデーション背景・テキスト・進捗バー | Calm Design に反する。AI生成感の主因 |
| 絵文字によるカテゴリ・特徴表現（🐾⚡など） | Lucide Icons + テキストで置換 |
| 「AI が分析中」バッジ、AI/ロボットアイコン | Invisible AI 原則 |
| `rounded-2xl` (20px) 以上の角丸 | カジュアルすぎる |
| `box-shadow`（カード・ボタン・入力） | 視覚的な重さ |
| ホバー時の `translate-y` / `rotate` / `scale` | 軽薄なアニメーション |
| 「3秒で答え」「⚡爆速」系の軽口コピー | テックスタートアップ臭 |
| `type="number"` の input | iOS カンマバグ・ホイール誤操作 |
| 計算ボタン式（送信して計算） | リアルタイム計算が現代的 |
| AdSense 自動広告 | CLS 損傷、手動配置のみ |
| 複数カラム入力フォーム | Baymard：1カラム推奨 |

---

## 9. デザインリファレンス

| プロダクト | 参照ポイント |
|---|---|
| **Linear** | Calm Design 全体。余白。タイポグラフィ中心の階層。暖かみのあるグレー |
| **Vercel** | 削ぎ落としたカラーパレット。余白の品質感。ボーダーの控えめさ |
| **Notion** | AI の透明な統合。機能の豊富さを感じさせない UI |
| **Stripe ダッシュボード** | アクセシブルなカラー。数値表示のタイポグラフィ |
| **Omni Calculator** | スライダー + 数値入力のハイブリッド、即時計算 |
| **CASIO keisan** | 計算機サイトとしての実直さ・密度・分類IA |

---

## 10. 実装と整合させるためのチェックリスト

新しいページ・コンポーネントを実装するとき：

- [ ] グラデーション（`bg-gradient-*`、`text-gradient-*`）を使っていない
- [ ] 絵文字を装飾として使っていない（テキスト中の例示は可）
- [ ] 角丸が `rounded-md` (8px) 以下
- [ ] `shadow-*` を使っていない
- [ ] hover で `translate` / `rotate` / `scale` を使っていない
- [ ] アクセントカラーは brand（indigo）のみ。orange / accent-* は登場しない
- [ ] アイコンは Lucide で、`text-*` ラベル と必ずセット
- [ ] コピーが事務的：「即時計算」◯ /「3秒で答え」✗
- [ ] 数値は `.tabular` クラスで桁揃え
- [ ] AdSense 枠は `min-height` 指定で CLS 対策

---

## 11. 衝突したら

`BASE_UI_RULE.md` ＞ `DESIGN.md` ＞ 個別実装。BASE_UI_RULE に書かれていない 計算屋 固有の規約（入力UI・AdSense・日本語運用）はこの DESIGN.md が一次情報。
