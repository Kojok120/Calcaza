import type { CalculatorMeta } from './types';

/**
 * 関連計算機枠に出す計算機を選ぶ。
 *
 * 背景: 以前は「同カテゴリの先頭数件を registry 順で拾う」だけだった。新しい
 * 計算機は registry でたまたま隣にいるページからしか参照されず、文脈が近い
 * 強いページからは参照されない。2026-09 の URL 検査で、公開 2 週間の新規
 * ページが「検出 - インデックス未登録」のまま参照元 0〜1 本だったのは、内部
 * リンクが sitemap と registry 順の隣接にしか無いこの構造が原因。
 *
 * 優先順位:
 *  1. `current.related` に明示された slug（記載順）
 *  2. `current` を `related` に挙げている計算機（相互参照）。新しいページが
 *     自分から既存の強いページを挙げるだけで、強いページの枠にも載る
 *  3. registry で `current` の次に並ぶ計算機（必ず 1 本）。どのページも直前の
 *     ページの枠に載るので、入ってくるリンクが 0 本のページが構造的に生まれない
 *     （語彙類似と巡回順だけでは、カテゴリに 1 本しか無いページが孤立した）。
 *     明示・相互参照だけで枠が埋まる場合も、最後の 1 枠はこの後継に譲る
 *  4. 同カテゴリで slug の語彙が近いもの。共有する語の希少さ（IDF）で重み付け
 *     するので、全計算機に共通する語（taiwan / calculator / ksa など）は自然に
 *     効かなくなり、国名・州名・制度名のような固有の語だけが効く
 *  5. 残りの同カテゴリ → 他カテゴリ。それぞれ語彙の近さ順、同点なら「registry で
 *     自分の次に来るページ」から巡回順に埋める。先頭固定だと registry の先頭数件が
 *     全ページの枠を独占し、末尾のページには 1 本も入ってこない
 *
 * 純関数。存在しない slug や自分自身は黙って捨てる（存在は `related.test.ts`
 * が registry 全体に対して検査する）。
 */
export function pickRelated(
  current: CalculatorMeta,
  all: CalculatorMeta[],
  limit = 6,
): CalculatorMeta[] {
  const bySlug = new Map(all.map((m) => [m.slug, m]));
  const idf = slugIdf(all);
  const currentTokens = slugTokens(current.slug);
  const currentIndex = Math.max(0, all.findIndex((m) => m.slug === current.slug));
  const n = all.length;
  const similarity = (m: CalculatorMeta): number => {
    let score = 0;
    for (const t of slugTokens(m.slug)) if (currentTokens.has(t)) score += idf.get(t) ?? 0;
    return score;
  };

  const picked: CalculatorMeta[] = [];
  const seen = new Set<string>([current.slug]);
  const push = (m: CalculatorMeta | undefined) => {
    if (!m || seen.has(m.slug)) return;
    seen.add(m.slug);
    picked.push(m);
  };

  const successor = n > 1 ? all[(currentIndex + 1) % n] : undefined;
  for (const slug of current.related ?? []) push(bySlug.get(slug));
  for (const m of all) if (m.related?.includes(current.slug)) push(m);
  push(successor);

  type Ranked = { m: CalculatorMeta; distance: number; score: number };
  const rest: Ranked[] = all
    .map((m, index) => ({ m, distance: (index - currentIndex + n) % n, score: similarity(m) }))
    .filter(({ m }) => !seen.has(m.slug));
  const byScoreThenCyclic = (a: Ranked, b: Ranked) => b.score - a.score || a.distance - b.distance;
  for (const { m } of rest.filter(({ m }) => m.category === current.category).sort(byScoreThenCyclic)) push(m);
  for (const { m } of rest.filter(({ m }) => m.category !== current.category).sort(byScoreThenCyclic)) push(m);

  const result = picked.slice(0, limit);
  // 明示・相互参照が limit 本以上あると後継が切り落とされ、保証が崩れる。
  // その場合は最後の 1 枠を後継に譲る（limit が 1 なら後継だけになる）。
  if (successor && limit > 0 && !result.some((m) => m.slug === successor.slug)) {
    result[Math.min(limit, result.length) - 1] = successor;
  }
  return result;
}

/**
 * 語彙として意味を持たない語。slug に混ざる各言語の前置詞・接続詞と、年号。
 * 稀な語ほど IDF が高くなるので、たとえば `de` を含む slug が 2 本しか無いと
 * その 2 本が「強く関連する」と誤判定される（calcaza の imposto-de-renda と
 * margem-de-lucro）。年号は同じ年度の無関係なページを結びつけてしまう。
 * `1099` / `401k` / `529` のような制度名の数字は意味があるので残す。
 */
const STOPWORDS = new Set([
  // en
  'of', 'and', 'the', 'to', 'in', 'for', 'by', 'vs', 'per', 'from', 'on', 'with', 'no',
  // es
  'de', 'del', 'la', 'el', 'los', 'las', 'y', 'por', 'para', 'con', 'sin',
  // pt
  'do', 'da', 'dos', 'das', 'e', 'em', 'com',
  // id
  'dan', 'di', 'ke', 'untuk',
]);
const YEAR = /^(19|20)\d{2}$/;

/** slug を `-` で割った語。1 文字の語・stopword・年号は落とす。 */
function slugTokens(slug: string): Set<string> {
  return new Set(
    slug.split('-').filter((t) => t.length >= 2 && !STOPWORDS.has(t) && !YEAR.test(t)),
  );
}

/** 語 → log(N / df)。全 slug に現れる語は 0 になり、順位に影響しなくなる。 */
function slugIdf(all: CalculatorMeta[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const m of all) for (const t of slugTokens(m.slug)) df.set(t, (df.get(t) ?? 0) + 1);
  const n = all.length;
  return new Map([...df].map(([t, d]) => [t, Math.log(n / d)]));
}
