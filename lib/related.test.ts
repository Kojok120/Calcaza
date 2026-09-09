import { describe, expect, it } from 'vitest';
import { calculators } from '@/calculators/registry';
import type { CalculatorMeta } from './types';
import { pickRelated } from './related';

/**
 * 関連計算機の選定ロジック（lib/related.ts）を固定する。
 *
 * 前半は合成データで優先順位を 1 つずつ検証する。後半は実際の registry を
 * 読み、`related` に書かれた slug が実在すること（typo で黙って捨てられない
 * こと）を検査する。
 */

function meta(slug: string, category: string, related?: string[]): CalculatorMeta {
  return {
    slug,
    title: slug,
    description: '',
    primaryKw: '',
    relatedKws: [],
    category: category as CalculatorMeta['category'],
    applicationCategory: 'FinanceApplication',
    publishedAt: '2026-01-01',
    updatedAt: '2026-01-01',
    faqs: [],
    affiliates: [],
    ...(related ? { related } : {}),
  };
}

const slugs = (list: CalculatorMeta[]) => list.map((m) => m.slug);

describe('pickRelated', () => {
  it('明示した related を記載順で先頭に出し、自分自身と存在しない slug は捨てる', () => {
    const all = [
      meta('a', 'x', ['c', 'a', 'missing', 'b']),
      meta('b', 'x'),
      meta('c', 'y'),
    ];
    expect(slugs(pickRelated(all[0], all))).toEqual(['c', 'b']);
  });

  it('自分を related に挙げているページを相互参照として出す（明示の次）', () => {
    const all = [
      meta('strong', 'x'),
      meta('other', 'x'),
      meta('new-page', 'x', ['strong']),
    ];
    // strong 側は何も書いていないが、new-page が挙げているので枠に載る
    expect(slugs(pickRelated(all[0], all))).toEqual(['new-page', 'other']);
    // new-page 側は明示が先
    expect(slugs(pickRelated(all[2], all))).toEqual(['strong', 'other']);
  });

  it('同カテゴリの中では slug の語彙が近い順、同点なら registry 順', () => {
    const all = [
      meta('gosi-net-salary-ksa', 'labor'),
      meta('end-of-service-gratuity-kuwait', 'labor'),
      meta('overtime-pay-ksa', 'labor'),
      meta('overtime-pay-kuwait', 'labor'),
    ];
    // overtime+pay を共有する ksa 版 > kuwait を共有する退職金 > 何も共有しない GOSI
    expect(slugs(pickRelated(all[3], all))).toEqual([
      'overtime-pay-ksa',
      'end-of-service-gratuity-kuwait',
      'gosi-net-salary-ksa',
    ]);
  });

  it('全 slug に共通する語（taiwan など）は順位に影響しない', () => {
    const all = [
      meta('salary-payroll-taiwan', 'tax'),
      meta('gift-tax-taiwan', 'tax'),
      meta('year-end-bonus-net-taiwan', 'tax'),
    ];
    // year-end-bonus と共有するのは taiwan だけ → registry 順のまま
    expect(slugs(pickRelated(all[2], all))).toEqual(['salary-payroll-taiwan', 'gift-tax-taiwan']);
  });

  it('同カテゴリを他カテゴリより先に出し、他カテゴリ内でも語彙の近さで並べる', () => {
    const all = [
      meta('dewa-bill-uae', 'utility'),
      meta('golden-visa-cost-uae', 'visa'),
      meta('sec-electricity-bill-ksa', 'utility'),
      meta('salik-toll-monthly-uae', 'car'),
    ];
    expect(slugs(pickRelated(all[0], all))).toEqual([
      'sec-electricity-bill-ksa', // 同カテゴリ（共有語なし）
      'golden-visa-cost-uae', // 他カテゴリ、uae を共有、registry 順で先
      'salik-toll-monthly-uae',
    ]);
  });

  it('limit で切り、重複は出さない', () => {
    const all = [
      meta('a', 'x', ['b', 'b']),
      meta('b', 'x', ['a']),
      meta('c', 'x'),
      meta('d', 'x'),
    ];
    expect(slugs(pickRelated(all[0], all, 2))).toEqual(['b', 'c']);
    expect(pickRelated(all[0], all).length).toBe(3);
  });
});

/**
 * 実行時に `pickRelated` へ渡るのは registry.ts が export する `calculators`
 * そのものなので、検査もそれを使う（ディスク上の meta.ts を glob で集めると、
 * 登録されていない計算機まで「実在する」と誤判定する）。registry.ts は各計算機の
 * index.ts 経由で content.mdx まで import するため、vitest.config.ts の
 * `mdxStub` プラグインが MDX を空コンポーネントに差し替えている。
 */
describe('registry の related', () => {
  const bySlug = new Set(calculators.map((m) => m.slug));

  it('registry が空でない', () => {
    // MDX スタブや alias の不備で import が空振りすると、以下の検査が全て素通りする
    expect(calculators.length).toBeGreaterThan(0);
  });

  it('related の slug は全て registry 登録済みの計算機を指し、自分自身と重複を含まない', () => {
    for (const m of calculators) {
      const related = m.related ?? [];
      const unknown = related.filter((s) => !bySlug.has(s));
      expect(unknown, `${m.slug}: 存在しない related`).toEqual([]);
      expect(related, `${m.slug}: 自分自身を related に含む`).not.toContain(m.slug);
      expect(new Set(related).size, `${m.slug}: related に重複`).toBe(related.length);
    }
  });

  it('どの計算機の関連枠も空にならない', () => {
    for (const m of calculators) {
      expect(pickRelated(m, calculators).length, m.slug).toBeGreaterThan(0);
    }
  });
});
