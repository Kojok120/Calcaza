# LAUNCH.md — ローンチ準備手順（sacalculo / es-US 版）

> 📌 **本書のスコープ**: US Hispanic（es-US、sacalculo.com）向けローンチ手順。`keisanya`（日本語）から fork した scaffold をベースに、US 法令・通貨・アフィリエイト ASP に合わせて差し替え済み。
> - ドメイン: `sacalculo.com`（取得済）
> - GitHub リポジトリ: US 用新規リモート（未確定）
> - AdSense: 本人名義の別申請が必要。サイトが完全に es-US で動作・5+ 計算機公開後に申請
> - 法令: 連邦 **FTC 16 CFR Part 255**（Endorsement Guides）/ **CAN-SPAM Act** / **COPPA**。州プライバシー法 **CCPA / CPRA**（カリフォルニア）/ **VCDPA**（バージニア）/ **CPA**（コロラド）/ **CTDPA**（コネチカット）/ **UCPA**（ユタ）他。CCPA 対象なら "Do Not Sell or Share My Personal Information" opt-out リンク必須
> - 決済通貨・税務: USD（AdSense 受取は USD wire、Treaty W-8BEN で米国源泉 0%）
> - アフィリエイト: **Impact** / **CJ Affiliate** / **ShareASale** / **Mediavine**（PV 50k 〜要件） / **Amazon Associates US** / Tax-CPA SaaS 直（TurboTax en español, TaxAct, QuickBooks SE）
> - 検索エンジン申請: Google Search Console（US プロパティで設定）/ Bing Webmaster Tools（US で 6-7% シェア、申請推奨）

> §1〜§6 の Cloudflare / GitHub / AdSense / Search Console 手順はサイト共通。§7 アフィリエイト・§8 法的ページ・§9 検証は US es-US 向けに整備済み。

---

> 「まだ何も準備していない」状態から本番公開までに必要な、外部サービス登録・設定のすべてを順番に書いたドキュメント。
> 2026 年 4 月時点の各社公式ドキュメントを基にしているため、実作業時は本文末尾の URL を必ず開いて差分を確認すること。

---

## 着手順序（最短ローンチパス）

時系列に並べた推奨順序。各項目の詳細は後続セクション参照。

1. **独自ドメイン取得**（[§ 1](#1-独自ドメイン取得)）
2. **Cloudflare アカウント作成** → DNS 移管（[§ 2](#2-cloudflare-アカウント作成)）
3. **GitHub に push** → Cloudflare Pages 連携 → 初回デプロイ（[§ 3](#3-cloudflare-pages-デプロイ)）
4. **独自ドメインを Pages に割り当て**（[§ 3-3](#3-3-独自ドメインの割り当て)）
5. **Cloudflare Web Analytics** 有効化、トークン取得（[§ 4](#4-cloudflare-web-analytics)）
6. **プライバシーポリシー / 運営者情報 / 免責事項 / お問い合わせ** ページを実コンテンツで整備（[§ 8](#8-公開前の法的ページ整備)）
7. **計算機 5 本 + 各 500 語以上の解説** を公開（CLAUDE.md M1 ゴール）
8. **Google Search Console** にドメイン追加 → 所有権確認 → サイトマップ提出（[§ 5](#5-google-search-console)）
9. **Google AdSense** 申請（[§ 6](#6-google-adsense)）
10. AdSense 承認後 → Publisher ID を Cloudflare Pages の環境変数に登録 → `public/ads.txt` を配信
11. **A8.net / もしもアフィリエイト / 楽天アフィリエイト** に登録（[§ 7](#7-アフィリエイト-asp)）
12. **Rich Results Test / OGP Debugger** で全計算機ページを検証（[§ 9](#9-検証ツール)）
13. **バリューコマース** はコンテンツ 20 本到達時に申請、**Amazon アソシエイト本家** は安定運用後に申請

---

## 1. 独自ドメイン取得

### 推奨レジストラ比較

| レジストラ | 価格感（.com） | メモ |
|---|---|---|
| **Cloudflare Registrar** | ICANN 卸値（実費のみ、上乗せなし） | **更新時の値上げが無く、長期保有では最安帯**。`.jp` 非対応。Cloudflare アカウント必須。 |
| **お名前.com** | 初年度 1 円〜数百円のセール多数、更新時 1,500 円前後 | `.jp` 含め幅広く対応。広告メールが多い。 |
| **ムームードメイン** / Value Domain | 中位価格、UI わかりやすい | 個人運営で人気 |

### このサイトでの推奨

- **`.com` か `.jp`** を取る（信頼性とブランド継続性）
- **長期運用前提なら Cloudflare Registrar**。Pages との連携が一段スムーズ
- `.jp` を取る場合は国内レジストラ（お名前.com 初年度激安 → 更新前に Cloudflare に移管が定石）
- `lib/site.ts` の `SITE_URL` をこのドメインに合わせて更新

---

## 2. Cloudflare アカウント作成

### 2-1. アカウント作成

1. <https://dash.cloudflare.com/sign-up> にアクセス
2. メール + パスワードで Sign up（無料、クレジットカード不要）
3. 受信メールのリンクで Verify

### 2-2. ドメインを Cloudflare DNS に乗せる（推奨）

1. Dashboard 右上の **Add a site** をクリック
2. ドメイン名（例: `keisanya.com`）を入力 → **Free Plan** を選択
3. 既存 DNS レコードのスキャン結果を確認 → **Continue**
4. 表示される Cloudflare ネームサーバ 2 本（例: `xxx.ns.cloudflare.com`）をコピー
5. ドメインレジストラ管理画面でネームサーバを Cloudflare のものに変更
6. 反映後（数分〜数十分）、Cloudflare 側で **Active** 表示になれば完了

**メリット**: Web Analytics の自動注入 / DNS の即時編集 / 後述の Pages の Custom Domain 設定がワンクリック。

---

## 3. Cloudflare Pages デプロイ

公式: <https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/>

### 3-1. リポジトリ → Pages 連携

1. GitHub にリポジトリを push（プライベート可）
2. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** タブ → **Import an existing Git repository**
3. 初回は GitHub OAuth で対象 Org / Repo へのアクセスを Cloudflare に許可
4. 対象リポジトリを選択 → **Begin setup**
5. **Set up builds and deployments** で以下を設定:

| フィールド | 値 |
|---|---|
| Framework preset | **Next.js (Static HTML Export)** |
| Build command | `pnpm build`（または `npx next build`） |
| Build output directory | `out` |
| Production branch | `main` |
| Root directory | （空） |

6. **Save and Deploy** → 初回ビルド後、`<project>.pages.dev` の URL が払い出される

`next.config.ts` に `output: 'export'` が入っていることが前提（このリポジトリは設定済み）。

### 3-2. ビルド環境（Node バージョン）

公式: <https://developers.cloudflare.com/pages/configuration/build-image/>

- v3 ビルドシステム（2025 〜 2026 のデフォルト）の Node.js デフォルト: **22.16.0**
- 上書き方法（推奨優先度順）:
  1. リポジトリルートに `.nvmrc` を置く（例: `20.18.0`）
  2. Pages 設定の Environment variables で `NODE_VERSION` を指定
- v3 では `package.json` の `engines.node` は読まれない点に注意

### 3-3. 独自ドメインの割り当て

公式: <https://developers.cloudflare.com/pages/configuration/custom-domains/>

1. Pages プロジェクト → **Custom domains** → **Set up a domain**
2. ドメイン名（例: `keisanya.com` または `www.keisanya.com`）を入力 → **Continue**

**Apex ドメインの場合**: 当該ドメインを Cloudflare DNS に追加済みであれば、CNAME フラットニングが自動で作成される。

**サブドメインの場合**:

| Type | Name | Content |
|---|---|---|
| CNAME | www | `<project>.pages.dev` |

を Cloudflare DNS（または外部 DNS）で作成。

**重要**: Pages の Custom domains 画面で先に登録 → その後 DNS レコード追加。逆順だと 522 エラーになる。

### 3-4. 環境変数の設定

公式: <https://developers.cloudflare.com/pages/configuration/build-configuration/>

- 場所: Pages プロジェクト → **Settings** → **Environment variables**
- **Production** と **Preview** で別の値を設定可能（Preview は PR ブランチ用）
- `NEXT_PUBLIC_*` プレフィックスの変数はビルド時に inline されるため、ここに設定しておけば `next build` 時に注入される
- 機微な値は **Encrypt** にチェックを入れてシークレット扱い

このリポジトリで設定する変数:

| 変数名 | 用途 | 値の例 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | サイト URL（OG / sitemap で使用） | `https://keisanya.com` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense Publisher ID | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | Cloudflare Web Analytics トークン | 32 桁 hex |

---

## 4. Cloudflare Web Analytics

公式: <https://developers.cloudflare.com/web-analytics/get-started/>

Free プランで使用可能。Cookie 不使用、GDPR / プライバシー法対応の軽量アクセス解析。

### 4-1. Cloudflare Pages にデプロイしている場合（最も簡単）

1. Dashboard → **Workers & Pages** → 対象 Pages プロジェクトを選択
2. **Metrics** タブから Web Analytics を有効化
3. 次回デプロイ時に自動でビーコンが注入される（スニペットを自分で貼る必要なし）
4. ダッシュボードの **Analytics & Logs → Web Analytics** から閲覧

この場合、**`NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` を設定しなくても動作する**（自動注入のため）。手動でも入れたい場合は次節を参照。

### 4-2. 外部ホスト or トークン手動管理の場合

1. Dashboard 左サイドバー → **Web Analytics** → **Add a site**
2. ホスト名（例: `keisanya.com`）を入力 → **Done**
3. **Manage site** セクションに表示される JavaScript スニペットをコピー
4. スニペット内 `data-cf-beacon='{"token": "XXXX..."}'` の **token 値（32 桁 hex 文字列）** が「サイトトークン」

このトークンを **Cloudflare Pages → Settings → Environment variables** で:

```
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN = <32桁のhex文字列>
```

として **Production** に登録。Preview にも同じものを入れて構わない。これで `app/layout.tsx` 内で `<body>` 末尾に beacon が条件付き注入される（実装済み）。

トークンはダッシュボードの **Manage site** 画面でいつでも再表示可能。

### 4-3. 注意事項

- `Cache-Control: public, no-transform` を返している場合、Cloudflare proxy 経由の自動注入は無効化される
- Pages 経由なら問題なし

---

## 5. Google Search Console

公式: <https://support.google.com/webmasters/answer/9008080>

### 5-1. プロパティ追加と所有権確認

1. <https://search.google.com/search-console> にログイン
2. **プロパティを追加** → 2 種類から選ぶ:
   - **ドメイン プロパティ**（`example.com` 全体、サブドメイン + http/https すべてカバー）→ DNS TXT レコードでの確認**必須**
   - **URL プレフィックス プロパティ**（`https://www.example.com/` のみ）→ HTML タグなど複数の確認方法から選択可
3. 推奨: **ドメインを Cloudflare DNS に乗せているなら「ドメイン プロパティ」+ DNS TXT 認証** が一番素直

#### DNS TXT 認証の手順

1. Search Console が指定する文字列（`google-site-verification=...`）をコピー
2. Cloudflare Dashboard → 対象ドメイン → **DNS** → **Add record**
   - Type: `TXT`
   - Name: `@`
   - Content: `google-site-verification=...`（取得した値）
3. **Save** → Search Console に戻り **確認**

### 5-2. サイトマップ送信

公式: <https://support.google.com/webmasters/answer/7451001>

1. Search Console 左サイドバー → **サイトマップ**
2. 「新しいサイトマップの追加」に `sitemap.xml` を入力 → **送信**
3. このリポジトリは `next-sitemap` 想定で、ビルド後 `out/sitemap.xml` が生成される
4. デプロイ後 `https://<your-domain>/sitemap.xml` が 200 を返すことを確認してから提出
5. `robots.txt` にも `Sitemap: https://...` 行が入っていれば、所有者権限なしでも Google に拾われる（このリポジトリの `app/robots.ts` で対応済み）

### 5-3. インデックス促進

- 重要ページ（トップ + 計算機ページ）は Search Console → **URL 検査** → **インデックス登録をリクエスト** で個別申請
- 1 日あたりの上限あり（10 件程度）

---

## 6. Google AdSense

公式ヘルプ: <https://support.google.com/adsense/answer/10162>（日本語あり）
申請フォーム: <https://adsense.google.com/adsense/signup>

### 6-1. 申請の前提条件

公式に明示されているもの:

- 申請者は **18 歳以上**
- サイトが「**魅力的な独自のコンテンツ**」を提供していること
- **AdSense プログラム ポリシー** に準拠（オリジナル性、暴力・性的・違法コンテンツ禁止 等）
- 申請者がそのサイトの HTML ソースにアクセスできること（審査用コードを `<head>` に貼る必要があるため）

実務上ほぼ必須:

- **プライバシーポリシー** ページ（広告・Cookie・第三者配信について明記）
- **運営者情報 / お問い合わせ** ページ
- 一定数のコンテンツ記事（公式は数を明記していないが、計算機 5-10 本 + 各 500 語以上の解説、合計 20-30 ページが現実的な目安）
- 独自ドメイン推奨（`*.pages.dev` のままでも申請可能だが通りにくい）

### 6-2. 申請フロー

1. <https://adsense.google.com/adsense/signup> にアクセス
2. Google アカウントでログイン → サイト URL、国（日本）、支払い通貨を入力
3. 利用規約に同意 → AdSense ダッシュボードに入る
4. ダッシュボード上部の **「AdSense コード」** をコピーし、サイト全ページの `<head>` に貼り付ける
   - このリポジトリでは `app/layout.tsx` で `NEXT_PUBLIC_ADSENSE_CLIENT` 設定時に自動で `pagead2.googlesyndication.com/.../adsbygoogle.js` を読み込む実装済み
   - したがって、**Cloudflare Pages の環境変数に Publisher ID を入れて再ビルド**すれば AdSense コードが配信される
5. 「サイトをリンクしました」ボタンで送信
6. **支払先情報**（住所・受取人氏名）を入力。住所確認の PIN コードが物理郵便で送られる場合あり
7. **税務情報フォーム**（W-8BEN 相当）を入力。日本居住者は租税条約の優遇税率を選択
8. 審査結果はメール通知。**通常数日、場合により 2 〜 4 週間**

### 6-3. Publisher ID と広告コードの取得

- 承認後、AdSense → **アカウント** → **アカウント情報** に **「サイト運営者 ID」** として `ca-pub-XXXXXXXXXXXXXXXX`（16 桁数字）が表示される
- これを `NEXT_PUBLIC_ADSENSE_CLIENT` として Cloudflare Pages の環境変数に登録

### 6-4. ads.txt の配信

- AdSense 管理画面のサイトリストで「ads.txt が必要です」警告が出る
- そこで表示されるテキスト 1 行をコピー:
  ```
  google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
  ```
- このリポジトリでは `public/ads.txt` に配置すれば `out/ads.txt` として配信される

### 6-5. 自動広告 vs 広告ユニット

| | 自動広告 | 広告ユニット（手動） |
|---|---|---|
| 設定 | AdSense → **広告** → サイト横の鉛筆 → 自動広告 ON | AdSense → **広告** → **広告ユニットごと** で個別作成 |
| 必要コード | サイト全体の AdSense コードのみ | 共通コード + `<ins class="adsbygoogle">` を本文に配置 |
| 制御 | Google が配置・形式・本数を最適化 | `data-ad-slot` ごとに位置・サイズを手動制御 |

**このサイトの方針**: CLAUDE.md の「計算結果上下に 1-2 スロット」「過剰配置 NG」と整合させるため、**手動の広告ユニット**を使用。`lib/ads.ts` の `AD_SLOTS` と `components/ads/AdSlot.tsx` がこの方針で実装済み。

承認後にやること:
1. AdSense → **広告** → **広告ユニットごと** で **ディスプレイ広告** を 2 つ作成（in-feed と in-article）
2. 表示される `data-ad-slot` の 10 桁数字を、`lib/ads.ts` の `AD_SLOTS.inFeed1.id` / `AD_SLOTS.inArticle.id` に反映してコミット

---

## 7. アフィリエイト ASP

| ASP | 登録時審査 | 個人サイト要件 | 流れ |
|---|---|---|---|
| **A8.net** | **無し**（即時利用可） | サイト or 主要 SNS どれか 1 つ。サイトが無くても同社の「ファンブログ」で代用可。 | 会員登録 → サイト情報・銀行口座 → 完了 → 案件ごとに即時 or 審査制で提携 |
| **もしもアフィリエイト** | 会員登録は実質審査なし。**サイト登録時に審査あり**。 | 最低 5 記事程度推奨。 | 会員登録 → サイト登録 → 審査（数日）→ Amazon・楽天等のかんたんリンクが使える |
| **バリューコマース** | **サイト審査あり**（2 日〜 1 週間） | プライバシーポリシー、お問い合わせフォーム、最低 10-20 記事程度。 | 会員登録 → サイト情報入力 → 審査 → Yahoo!ショッピング等は即時提携 |
| **Amazon アソシエイト** | 仮承認 → **180 日以内に 3 件の適格販売** → 本審査 | サイト or 公開済アプリ。記事数の目安: 最低 10 記事公開。 | <https://affiliate.amazon.co.jp/> で申込 → ID 発行 → リンク貼付 → 180 日チャレンジ。失敗時は同 ID 復旧不可。 |
| **楽天アフィリエイト** | **無審査**（個人ブログは即時利用可） | 楽天会員登録（無料）。 | <https://affiliate.rakuten.co.jp/> → 楽天 ID でログイン → サイト登録 → 即時 |

### このサイトでの優先順位

1. **A8.net + もしもアフィリエイト + 楽天アフィリエイト** をまず登録（無審査・即時）
2. **Amazon は もしも経由**で Amazon 商品リンクを貼る方が、本家アソシエイトの 180 日要件を回避できて初期段階向き
3. **バリューコマース** は記事 20 本超えてから（Yahoo!ショッピング・大手 EC 案件が強い）
4. **Amazon アソシエイト本家**は安定運用後に申請

CLAUDE.md の `affiliates` 配列（`pet-insurance` / `pet-supplies` 等のカテゴリ）に対応する具体案件は、もしも・A8 のサーチで「ペット保険」「ペット用品」を検索して提携。

---

## 8. 公開前の法的ページ整備

`app/(marketing)/about/`、`app/(marketing)/privacy/`、`app/(marketing)/disclaimer/`、`app/(marketing)/contact/` の 4 ページは **es-US で実装済み**。AdSense 申請前に運営者名義・連絡先・更新日が最新かを確認するだけでよい。

### 8-1. プライバシーポリシー（CCPA / CPRA + 他州プライバシー法）

US には GDPR 相当の連邦プライバシー法は存在せず、**州ごとに独立したプライバシー法**が走る。CCPA / CPRA（カリフォルニア）が事実上の最低基準。`/privacy/` に以下を明記済み:

1. **収集する個人情報のカテゴリ**（IP / Cookie / アクセスログ / メール本文）
2. **収集の目的**（サイト運営、トラフィック分析、広告配信、問い合わせ返信、不正検知）
3. **第三者への共有 / "sale" 該当性**（Google AdSense / Cloudflare Web Analytics / アフィリエイト ASP — CCPA 上は personalised ads は "sharing" と解釈される可能性）
4. **CCPA / CPRA 権利**: 知る権利 / 削除権 / 訂正権 / opt-out of sale or share / 差別禁止
5. **opt-out 窓口**（メールリンクで対応可、サイト規模が小さければ専用ページ不要）
6. **Cookie / 類似技術の使用と無効化方法**

CCPA の閾値（年商 USD 25M / 100,000 California 居住者の個人情報処理 / 売上の 50% を個人情報売却から）に達しない**スモールビジネスは技術的には CCPA 対象外**だが、AdSense ポリシーと CPRA 動向から **CCPA 準拠** で書いてある。

### 8-2. AdSense ポリシー上の開示義務

`/privacy/` に以下を明記済み:

- Google AdSense を使用していること、Google および第三者ベンダーが Cookie を使用すること
- パーソナライズド広告のオプトアウト URL: <https://www.google.com/ads/preferences/>
- サイト訪問者が AdSense Cookie を無効化できる旨

### 8-3. Cookie 同意 / 米国 opt-out モデル

- 米国は **opt-out モデル**（事前同意ではなく、ユーザーが拒否を申告できる仕組み）。EU 型の Cookie 同意バナーは法的に不要
- ただし **CCPA / CPRA 該当**なら "Do Not Sell or Share My Personal Information" リンクをフッター等に常時表示する必要があり、AdSense は **Restricted Data Processing (RDP)** モードで対応可能
- **EU / UK ユーザーが訪問する場合は GDPR / UK GDPR 適用** → AdSense の **EU User Consent Policy** 対応 CMP を有効化（AdSense → **プライバシーとメッセージ**）
- **Global Privacy Control (GPC)** ヘッダの尊重は CCPA 上のベストプラクティス

### 8-4. アフィリエイト / 広告開示（FTC 16 CFR Part 255）

- **FTC Endorsement Guides (16 CFR Part 255, 2023 改訂)** に従い、アフィリエイト / 有償リンクを「ad」「sponsored」「#ad」「affiliate link」と**明確かつ近接**に開示
- 計算機ページ末尾の disclaimer 領域 + アフィリエイトリンクの直前に表記
- "Como afiliado de Amazon, ganamos por compras que califiquen." のような Spanish 表記を `/disclaimer/` に常時掲示
- **不実表示は FTC 民事制裁金の対象**。実体験ベースでない断定的レビューは書かない

### 8-5. CAN-SPAM Act / COPPA

- **CAN-SPAM**: メール一斉送信を行う場合のみ問題。**現状は contact form の単発返信のみで対象外**。将来ニュースレターを開始する場合は明示的 sender / unsubscribe / 物理住所が必須
- **COPPA**: 13 歳未満の子どもを対象としたサービスではないことを `/privacy/` に明記。意図的に子どもからデータ収集しない旨

### 8-6. 免責事項（YMYL）

`components/DisclaimerNote.tsx` で計算機ページ末尾に表示している内容に加え、`/disclaimer/` ページに明記済み:

- 計算結果は **estimación general** であり、最終判断はユーザーの自己責任
- Tax は **CPA / Enrolled Agent / IRS**、住宅ローンは **licensed mortgage broker**、健康は医師、法律は弁護士へ誘導（CLAUDE.md の YMYL 方針と整合）
- **Immigration legal advice は絶対書かない**（弁護士領域）
- リンク先サイトの内容について責任を負わない旨

### 8-7. 公開前チェックリスト

- [ ] `/privacy/`、`/about/`、`/disclaimer/`、`/contact/` の連絡先・運営者名・"Última actualización" が最新
- [ ] AdSense オプトアウト URL がリンク切れしていない
- [ ] 計算機ページに `DisclaimerNote.tsx` が露出している（YMYL 該当ページ全部）
- [ ] アフィリエイトリンク導入時は "Enlace de afiliado" / "Anuncio" 表記を直近に挿入
- [ ] Spain / México 方言混入チェック（`vosotros` / `móvil` / `coche` 等）

---

## 9. 検証ツール

### 9-1. 構造化データ

| ツール | URL | 用途 |
|---|---|---|
| **Google Rich Results Test** | <https://search.google.com/test/rich-results> | Google が実際にリッチリザルトを表示できるかの検証。`SoftwareApplication` / `FAQPage` / `BreadcrumbList` に対応。 |
| **Schema Markup Validator** | <https://validator.schema.org/> | schema.org 仕様準拠の純粋検証 |
| Search Console URL 検査 | Search Console 内 → **URL 検査** | 公開後、Google から見えている構造化データを確認 |

このリポジトリは `lib/jsonld.ts` で `WebApplication` + `FAQPage` + `BreadcrumbList` + `Organization` を生成。`lib/jsonld.test.ts` で形式テスト済み。

### 9-2. OGP / Twitter Card

| プラットフォーム | ツール |
|---|---|
| Facebook | <https://developers.facebook.com/tools/debug/>（Facebook ログイン必須） |
| X（旧 Twitter） | **公式 Card Validator は 2022 年に廃止**。X 上で実 URL を投稿してプレビュー確認するのが現実的 |
| LinkedIn | <https://www.linkedin.com/post-inspector/> |
| 汎用 | <https://www.opengraph.xyz>, <https://metatags.io> |

このリポジトリは `app/c/[slug]/opengraph-image.tsx` で動的 OG 画像を生成（`next build` 時に PNG 出力）。

### 9-3. パフォーマンス

| ツール | URL |
|---|---|
| **PageSpeed Insights** | <https://pagespeed.web.dev/>（Lighthouse + 実フィールドデータ） |
| **WebPageTest** | <https://www.webpagetest.org/> |

CLAUDE.md の品質バー: Lighthouse すべて 90+ をローンチ前に確認。

---

## 公式ドキュメント URL まとめ

- **Cloudflare Web Analytics**: <https://developers.cloudflare.com/web-analytics/get-started/>
- **Cloudflare Pages (Next.js Static)**: <https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/>
- **Cloudflare Pages Custom Domain**: <https://developers.cloudflare.com/pages/configuration/custom-domains/>
- **Cloudflare Pages Build Image**: <https://developers.cloudflare.com/pages/configuration/build-image/>
- **Cloudflare Pages Build Configuration**: <https://developers.cloudflare.com/pages/configuration/build-configuration/>
- **AdSense 概要 / 申請**: <https://support.google.com/adsense/answer/10162>
- **AdSense 申込フォーム**: <https://adsense.google.com/adsense/signup>
- **AdSense ヘルプセンター**: <https://support.google.com/adsense/>
- **Search Console 所有権確認**: <https://support.google.com/webmasters/answer/9008080>
- **Search Console サイトマップ送信**: <https://support.google.com/webmasters/answer/7451001>
- **Rich Results Test**: <https://search.google.com/test/rich-results>
- **Schema Markup Validator**: <https://validator.schema.org/>
- **Facebook Sharing Debugger**: <https://developers.facebook.com/tools/debug/>
- **A8.net**: <https://www.a8.net/>
- **もしもアフィリエイト**: <https://af.moshimo.com/>
- **バリューコマース**: <https://www.valuecommerce.ne.jp/>
- **Amazon アソシエイト**: <https://affiliate.amazon.co.jp/>
- **楽天アフィリエイト**: <https://affiliate.rakuten.co.jp/>

---

## 環境変数チェックリスト（Cloudflare Pages → Settings → Environment variables）

ローンチ時点で **Production** に設定すべきもの:

```
NEXT_PUBLIC_SITE_URL=https://<your-domain>
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=<32桁hex>
```

`NEXT_PUBLIC_ADSENSE_CLIENT` が未設定または `XXXX` を含む場合、AdSense スクリプトと広告 `<ins>` タグは出力されない（プレースホルダ表示にフォールバック、実装済み）。

`NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` が未設定なら Web Analytics の beacon は読み込まれない（Pages 自動注入を使う場合は設定不要）。
