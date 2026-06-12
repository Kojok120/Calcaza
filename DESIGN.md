# DESIGN.md — Calcaza（brazcalc）

> **デザイン系統**: keisanya 承認済みの「藍と朱の帳簿（Indigo & Vermilion Ledger）」を pt-BR 向けに翻案
> **対象スタック**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Cloudflare Pages (SSG)
> **対象ユーザー**: ブラジル在住の pt-BR 話者・モバイル中心・検索流入 70%+
> **基盤**: BASE_UI_RULE.md の Calm Design + Strategic Minimalism + Invisible AI に準拠

---

## 0. このドキュメントの位置づけ

`BASE_UI_RULE.md` がプロジェクト横断の UI 憲法、`DESIGN.md`（本書）が Calcaza 固有の補足・トークン定義。両者が衝突した場合は BASE_UI_RULE が優先する。

Calcaza 固有の関心事：
- 検索流入ユーザーが「答え」を最短で得るための即時計算（Cálculo na hora）
- pt-BR の数値表記（R$ 1.234,56 — 千位ピリオド・小数カンマ）を崩さない
- 数値表示の整列（tabular-nums）
- AdSense 枠の CLS 対策

---

## 1. デザイン哲学（3原則）

### 原則1：Strategic Minimalism — すべての要素が存在理由を持つ

画面上のすべての要素は、ユーザーを「数字が出る」というゴールに近づけるために存在する。装飾的なグラデーション、不要なアイコン、飾りのイラストは置かない。

### 原則2：Invisible AI — AIは透明であること

「AI が試算しました」のようなバッジ・ラベルは付けない。軽口コピーも排除する。ツール自体が賢く、静かに振る舞う。

### 原則3：Typography-driven Hierarchy — タイポグラフィで導く

色やアイコンに頼らず、文字の大きさ・太さ・濃淡で情報の優先順位を伝える。結果の数値は最も大きく、補足は小さく薄く。

### 計算機サイト固有の追加原則

- **Above-the-fold で結果が見える**：モバイルでも入力 → 結果のスクロール距離を最小化
- **Reactive Calculation**：入力変更で即時再計算。送信ボタンは置かない
- **AdSense は枠を予約する**：`min-height` で CLS 0.1 未満を維持

---

## 2. カラーシステム —「藍と朱の帳簿」

主役のアクセントは **brand（藍 / índigo）**。例外として **朱（shu / vermelhão）** を「検証スタンプ（carimbo）・控除合計・FAQ の R マーカー・ワードマークのドット」にのみ許可する。orange 等のその他の二次アクセントは使わない。

世界観: 紙（温かいオフホワイト + 紙ノイズ）× 墨 × 藍（深い知性）× 朱（検収印）。keisanya と同一トークン。

### 2.1 Tailwind v4 トークン（`app/globals.css` に定義）

命名と値は `globals.css` の実装が常に正。

```css
@theme {
  /* Brand (藍) — 主役のアクセント */
  --color-brand-50:  #ecf2f9;
  --color-brand-100: #dbe6f2;
  --color-brand-200: #b9d0e6;
  --color-brand-300: #8fb2d7;
  --color-brand-400: #5687bb;
  --color-brand-500: #27619f;  /* 主要ブランド色 */
  --color-brand-600: #1d4a7e;  /* hover / 強調 */
  --color-brand-700: #173a63;  /* ヒーロー数字・リンク */
  --color-brand-800: #122e4f;
  --color-brand-900: #0c1f36;

  /* 朱 — carimbo・控除合計・R マーカー専用 */
  --color-shu:      #c83a2b;
  --color-shu-deep: #a92e21;

  /* Semantic — ステータス表示専用、装飾には使わない */
  --color-success-500: #2e9e63;  /* live ドット兼用 */
  --color-warning-500: #b5801f;
  --color-danger-500:  #c83a2b;

  /* Surface（紙） — 画面の90%以上を占める */
  --color-surface-0: #faf8f2;
  --color-surface-1: #f4f0e6;
  --color-surface-2: #ece7d9;
  --color-surface-3: #e3ddcb;

  /* Field — 入力欄・detalhamento の白 */
  --color-field: #ffffff;

  /* Ink (墨) */
  --color-ink-1: #1f242e;
  --color-ink-2: #4a5160;
  --color-ink-3: #7d8494;
  --color-ink-4: #a3a8b4;

  /* Border (罫線) */
  --color-border-subtle:  #e8e2d2;
  --color-border-default: #ddd6c4;
  --color-border-strong:  #c9c0a9;  /* 入力枠 1.5px */
}
```

ダークモード（`.dark`）は「深い藍墨の紙面に紙色のテキスト」で同じ世界観を維持する。surface は `#141a26`〜`#2c3950`、ink は紙トーン、brand は明度反転（50↔900 の役割を保ったまま明るさだけ反転）、朱は `#e25f4f` に明るく調整。値は `globals.css` の `.dark` ブロックが正。

### 2.2 運用ルール

- ベース（surface / ink / border）が画面の 90%+ を占める
- brand（藍）は CTA・アクティブ状態・フォーカスリング・ヒーロー数字・進捗バーなど「次のアクション or 注目点」にのみ使用
- **朱（shu）は印にのみ**: carimbo（検証スタンプ）・控除合計・FAQ の R マーカー・ワードマークのドット。それ以外の装飾・強調には使わない
- セマンティックカラーはステータス表示のみ。装飾には絶対に使わない
- 色だけで情報を伝えない。テキストラベル or アイコンを併用（WCAG 2.2）
- 本文と背景のコントラスト比は最低 4.5:1（WCAG AA）
- 紙ノイズ（SVG feTurbulence の data URI）は `body` 背景にのみ適用

---

## 3. タイポグラフィ

### 3.1 フォント

`next/font/google` で Inter（本文・数値）/ **IBM Plex Sans 400・600・700（ディスプレイ）** を読み込み、CSS 変数経由で `@theme` に接続する。

```css
--font-sans:    var(--font-inter), "Inter var", "Inter", system-ui, sans-serif;   /* 本文 */
--font-numeric: var(--font-inter), "Inter var", "Inter", Arial, sans-serif;       /* 数値 */
--font-display: var(--font-ibm-plex), "IBM Plex Sans", "Inter", sans-serif;       /* 見出し */
```

- **`font-display`（IBM Plex Sans）の適用先**: H1 / H2 / ロゴワードマーク / carimbo / セクションラベル（「― Entradas ―」「― Detalhamento ―」「Cálculo na hora」）/ FAQ の P・R マーカー
- 本文・数値は Inter のまま（pt-BR の桁区切り group=「.」decimal=「,」表示は既存実装を変えない）
- 数値は `.tabular` ユーティリティ（`font-variant-numeric: tabular-nums lining-nums`）で桁ズレを防ぐ

### 3.2 タイプスケール

| 用途 | サイズ | ウェイト |
|---|---|---|
| ページタイトル (H1) | 30px / sm:36px | 700 |
| セクション見出し (H2) | 24px | 700 |
| カード見出し (H3) | 18px / 20px | 600 |
| 本文 | 16px | 400 |
| 補助・キャプション | 14px / 12px | 400 |
| 結果数値（強調） | 36px / sm:48px | 600 |

### 3.3 pt-BR 運用ルール

- 本文行間：`--leading-normal: 1.75`
- 見出し行間：`--leading-tight: 1.25`
- `palt` / `word-break: keep-all` 等の CJK 専用設定は**使わない**（pt-BR には不要）
- 通貨表記: R$ 1.234,56（Intl `pt-BR`）。ヒーロー数字では先頭の「R$」を小さく墨色で添える（`HeroAmount`）
- pt-PT 方言は UI テキストにも禁止（telemóvel / ecrã / factura 等）

---

## 4. スペーシングとレイアウト

8px グリッドを基準に Tailwind 標準スケールを使用。追加：`--spacing-14: 3.5rem`（高さ 56px の入力UI 用）。

| ブレークポイント | 幅 | 主用途 |
|---|---|---|
| Mobile | <768px | 完全1カラム |
| Tablet | 768-1023px | 1カラム |
| Desktop | ≥1024px | 計算機は入力/結果の2カラム |

コンテンツの最大幅は `max-w-5xl`（1024px）を基準に、本文 prose は `max-w-3xl`。

---

## 5. コンポーネントスタイル

### 5.1 共通ルール（BASE_UI_RULE 由来 + 帳簿モックでの例外）

- **box-shadow は原則使わない**。例外は2つ: 計算機の台紙 `.shadow-ledger` と Select のポップオーバー
- **角丸**: `--radius-md: 10px`（入力・カード）/ `--radius-lg: 14px`（計算機の台紙のみ）。`rounded-2xl` 以上は禁止
- **グラデーションは原則禁止**。例外は2つ: 計算機ヘッダ帯のかすかな藍 `.head-band`、H1 のマーカー風アクセント `.marker-accent`
- **ホバー時の変化は控えめに**：背景色の微変化 or ボーダー濃度アップに留める
- **transform 系のホバーは使わない**（carimbo の静的な `rotate(-7deg)` は装飾であり対象外）

### 5.2 カード（計算機カード・FAQ・関連リンク）

```
背景:     bg-surface-0 または bg-surface-1
ボーダー: border border-border-default
影:       なし
ホバー:   bg-surface-1 → bg-surface-2 / border → border-strong
```

### 5.3 ボタン

| タイプ | 背景 | テキスト | 用途 |
|---|---|---|---|
| Primary | `bg-ink-1` | `text-surface-0` | メインCTA |
| Secondary | `bg-surface-0` + border | `text-ink-1` | 補助 |
| Ghost | 透明 | `text-ink-2` | 控えめ |
| Danger | `bg-danger-500` | white | 破壊的 |

ボタン高さ：`h-11` (44px) / `h-12` 標準 / `h-14` 大。角丸は `rounded-md`。

### 5.4 入力UI（計算機固有）

- `<input type="text" inputmode="decimal">` を使用（`type="number"` は禁止）
- 高さ `h-14` (56px) でタッチ範囲 48×48px 以上を確保
- 見た目: 白地（`bg-field`）+ 太罫線 `border-[1.5px] border-border-strong` + `rounded-md` (10px)。数値は `.tabular text-lg font-semibold`
- フォーカス時は **藍リング** `focus:border-brand-500 focus:ring-[3px] focus:ring-brand-100`
- 結果はリアルタイム計算

### 5.5 結果表示（ResultStat = detalhamento）

計算機の結果面は「detalhamento（明細）」のメタファー。`CalculatorShell` がヘッダ帯（live ドット + Cálculo na hora）/ 罫線入り入力面（`.bg-ledger-ruled`）/ 白の detalhamento 面 / 出典・編集フッタ（provenance 帯: "Preparado e verificado pela Equipe Editorial da Calcaza"）を構成する。

- `emphasis`（既定）: ヒーロー値。ラベル + **藍の大型数字** `text-4xl sm:text-5xl font-semibold text-brand-700 tabular`（先頭の R$ は小さく墨色）。枠なし
- `emphasis={false}`: 明細行。ラベルと値を **点線リーダー**（`.dotted-leader`）で結ぶ
- 数値の更新は **約320msのカウント遷移**（ease-out tween、pt-BR の区切り文字を保持、`prefers-reduced-motion` 時は即時）
- carimbo（検証スタンプ）は detalhamento の右上。二重円 + 「CALCAZA」+ `meta.reviewedAt ?? updatedAt` の月年（例 JUN 2026）を刻む（`CalcStampProvider` 経由）
- モバイルで detalhamento が画面外のときは**粘着結果バー**（藍地・最初のヒーロー値）を画面下部に表示

### 5.6 進捗バー / 内訳バー

```
背景: bg-surface-3
塗り: bg-brand-500
角丸: rounded-sm（4px）
影:   なし、グラデーション禁止
```

---

## 6. アイコン

**Lucide Icons (`lucide-react`)**、`strokeWidth={1.5}` 標準。カテゴリアイコンは `lib/icons.ts` に集約。

- アイコンは必ずテキストラベルとセットで使用
- カラー：`text-ink-2` 標準、アクティブ時 `text-ink-1`
- **絵文字は装飾用途では使わない**、イラスト・装飾画像は置かない

---

## 7. アニメーションとトランジション

| 対象 | duration | easing |
|---|---|---|
| ホバー | 150ms | ease-out |
| 展開・折りたたみ | 200ms | ease-in-out |
| 数値カウント遷移 | 320ms | cubic ease-out |
| ページ遷移 | 0ms（即時） | — |

- 結果数値はリアルタイム再計算 + 約320msのカウント遷移（`ResultStat` に実装済み）。`prefers-reduced-motion` 時は即時切替
- live ドットの鼓動 `.live-dot` は状態表示のため例外として許可
- バウンス・フェードイン出現・装飾的 transform は禁止
- `prefers-reduced-motion: reduce` は必ず尊重（`globals.css` で全アニメーション 0.01ms 化）

---

## 8. やらないことリスト

| やらないこと | 理由 |
|---|---|
| グラデーション（`.head-band` / `.marker-accent` を除く） | Calm Design に反する |
| 絵文字によるカテゴリ・特徴表現 | Lucide Icons + テキストで置換 |
| 「AI が分析中」バッジ | Invisible AI 原則 |
| `rounded-2xl` 以上の角丸 | カジュアルすぎる |
| `box-shadow`（`.shadow-ledger` / Select ポップオーバーを除く） | 視覚的な重さ |
| 朱（shu）を印以外の装飾に使う | 朱は検収印の色 |
| ホバー時の `translate-y` / `rotate` / `scale` | 軽薄なアニメーション |
| 軽口コピー | テックスタートアップ臭 |
| `type="number"` の input | iOS カンマバグ・ホイール誤操作 |
| 計算ボタン式 | リアルタイム計算が現代的 |
| AdSense 自動広告 | CLS 損傷、手動配置のみ |
| 複数カラム入力フォーム | Baymard：1カラム推奨 |
| pt-PT 方言（telemóvel / ecrã / factura / IVA） | pt-BR サイト。地理的ミスマッチ |

---

## 9. デザインリファレンス

| プロダクト | 参照ポイント |
|---|---|
| **keisanya（雛形）** | 藍と朱の帳簿デザインの原典実装 |
| **Linear / Vercel** | Calm Design、余白、ボーダーの控えめさ |
| **Stripe ダッシュボード** | アクセシブルなカラー、数値タイポグラフィ |
| **Omni Calculator** | 即時計算 UX |

---

## 10. 実装と整合させるためのチェックリスト

- [ ] グラデーションを使っていない（許可済み `.head-band` / `.marker-accent` を除く）
- [ ] 絵文字を装飾として使っていない
- [ ] 角丸が `rounded-md` (10px) 以下（計算機台紙のみ `rounded-lg` 14px）
- [ ] `shadow-*` を使っていない（`.shadow-ledger` / Select ポップオーバーを除く）
- [ ] hover で `translate` / `rotate` / `scale` を使っていない
- [ ] アクセントカラーは brand（藍）のみ。朱（shu）は印・控除合計・R マーカーに限定
- [ ] アイコンは Lucide で、テキストラベルと必ずセット
- [ ] コピーが事務的で pt-BR として自然（pt-PT 方言なし）
- [ ] 数値は `.tabular` クラスで桁揃え（R$ 1.234,56 表記）
- [ ] AdSense 枠は `min-height` 指定で CLS 対策

---

## 11. 衝突したら

`BASE_UI_RULE.md` ＞ `DESIGN.md` ＞ 個別実装。BASE_UI_RULE に書かれていない Calcaza 固有の規約（入力UI・AdSense・pt-BR 運用）はこの DESIGN.md が一次情報。
