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
      meta('overtime-pay-kuwait', 'labor'),
      meta('overtime-pay-ksa', 'labor'),
      meta('end-of-service-gratuity-kuwait', 'labor'),
    ];
    // overtime+pay を共有する ksa 版（registry で次でもある）> kuwait を共有する退職金 > 何も共有しない GOSI
    expect(slugs(pickRelated(all[1], all))).toEqual([
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
      meta('sec-electricity-bill-ksa', 'utility'),
      meta('golden-visa-cost-uae', 'visa'),
      meta('salik-toll-monthly-uae', 'car'),
    ];
    expect(slugs(pickRelated(all[0], all))).toEqual([
      'sec-electricity-bill-ksa', // 同カテゴリ（共有語なし。registry で次でもある）
      'golden-visa-cost-uae', // 他カテゴリ、uae を共有、巡回順で先
      'salik-toll-monthly-uae',
    ]);
  });

  it('前置詞や年号の共有は関連とみなさない', () => {
    const all = [
      meta('calculadora-imposto-de-renda', 'tax'),
      meta('calculadora-inss', 'tax'),
      meta('calculadora-hsa-aporte-maximo-2026', 'health'),
      meta('calculadora-credito-hijos-2026', 'tax'),
      meta('calculadora-margem-de-lucro', 'finance'),
    ];
    // `de` だけを共有する margem-de-lucro は他カテゴリの先頭に来ない（巡回順のまま hsa が先）
    expect(slugs(pickRelated(all[0], all))).toEqual([
      'calculadora-inss', // registry で次
      'calculadora-credito-hijos-2026', // 同カテゴリ
      'calculadora-hsa-aporte-maximo-2026', // 他カテゴリ、巡回順
      'calculadora-margem-de-lucro',
    ]);
    // `2026` だけを共有する hsa は他カテゴリの中で前に出ない（巡回順で最後）
    expect(slugs(pickRelated(all[3], all)).at(-1)).toBe('calculadora-hsa-aporte-maximo-2026');
  });

  it('registry で次のページは必ず 1 本入る（カテゴリが違っても）', () => {
    const all = [meta('a', 'x'), meta('b', 'y'), meta('c', 'x')];
    expect(slugs(pickRelated(all[0], all, 1))).toEqual(['b']);
    // 末尾のページの「次」は先頭
    expect(slugs(pickRelated(all[2], all, 1))).toEqual(['a']);
  });

  it('明示・相互参照で枠が埋まっていても、最後の 1 枠は registry で次のページに譲る', () => {
    const all = [meta('a', 'x', ['c', 'd', 'e']), meta('b', 'y'), meta('c', 'x'), meta('d', 'x'), meta('e', 'x')];
    // 明示 3 本で limit 3 が埋まるが、後継 b が最後の枠に入る
    expect(slugs(pickRelated(all[0], all, 3))).toEqual(['c', 'd', 'b']);
    // 後継が既に明示に含まれていれば差し替えない
    const all2 = [meta('a', 'x', ['b', 'c']), meta('b', 'y'), meta('c', 'x')];
    expect(slugs(pickRelated(all2[0], all2, 2))).toEqual(['b', 'c']);
  });

  it('同点の候補は registry で自分の次のページから巡回順に埋める', () => {
    const all = [meta('a', 'x'), meta('b', 'x'), meta('c', 'x'), meta('d', 'x')];
    expect(slugs(pickRelated(all[2], all, 2))).toEqual(['d', 'a']);
    expect(slugs(pickRelated(all[3], all, 2))).toEqual(['a', 'b']);
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

  it('どの計算機も、他の計算機の関連枠に少なくとも 1 回は出る（入ってくるリンクが 0 本のページを作らない）', () => {
    const incoming = new Map(calculators.map((m) => [m.slug, 0]));
    for (const m of calculators) {
      for (const picked of pickRelated(m, calculators)) incoming.set(picked.slug, (incoming.get(picked.slug) ?? 0) + 1);
    }
    const orphans = [...incoming].filter(([, n]) => n === 0).map(([slug]) => slug);
    expect(orphans).toEqual([]);
  });
});
