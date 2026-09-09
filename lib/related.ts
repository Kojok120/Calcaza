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
 *  3. 同カテゴリで slug の語彙が近いもの。共有する語の希少さ（IDF）で重み付け
 *     するので、全計算機に共通する語（taiwan / calculator / ksa など）は自然に
 *     効かなくなり、国名・州名・制度名のような固有の語だけが効く
 *  4. 残りの同カテゴリ → 他カテゴリ（それぞれ語彙の近さ → registry 順）
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

  for (const slug of current.related ?? []) push(bySlug.get(slug));
  for (const m of all) if (m.related?.includes(current.slug)) push(m);

  type Ranked = { m: CalculatorMeta; index: number; score: number };
  const rest: Ranked[] = all
    .map((m, index) => ({ m, index, score: similarity(m) }))
    .filter(({ m }) => !seen.has(m.slug));
  const byScoreThenRegistry = (a: Ranked, b: Ranked) => b.score - a.score || a.index - b.index;
  for (const { m } of rest.filter(({ m }) => m.category === current.category).sort(byScoreThenRegistry)) push(m);
  for (const { m } of rest.filter(({ m }) => m.category !== current.category).sort(byScoreThenRegistry)) push(m);

  return picked.slice(0, limit);
}

/** slug を `-` で割った語。1 文字の語（数字の桁など）は語彙として弱いので落とす。 */
function slugTokens(slug: string): Set<string> {
  return new Set(slug.split('-').filter((t) => t.length >= 2));
}

/** 語 → log(N / df)。全 slug に現れる語は 0 になり、順位に影響しなくなる。 */
function slugIdf(all: CalculatorMeta[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const m of all) for (const t of slugTokens(m.slug)) df.set(t, (df.get(t) ?? 0) + 1);
  const n = all.length;
  return new Map([...df].map(([t, d]) => [t, Math.log(n / d)]));
}
