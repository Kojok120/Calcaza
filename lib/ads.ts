/**
 * 計算機ページ内のAdSenseスロット定義。
 * 実際のslot ID（data-ad-slot）はAdSense審査通過後に差し替える。
 * 配置基準: DESIGN.md / SEO.md。計算ウィジェット内・結果直上は禁止。
 */
export const AD_SLOTS = {
  inFeed1: {
    id: 'in-feed-1',
    minHeight: 280,
    format: 'fluid' as const,
  },
  inArticle: {
    id: 'in-article',
    minHeight: 250,
    format: 'auto' as const,
  },
} as const;

export type AdSlotId = keyof typeof AD_SLOTS;
