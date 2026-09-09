import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * `.mdx` を空のコンポーネントに差し替える。registry.ts を import すると各計算機の
 * index.ts 経由で content.mdx まで届き、vitest は MDX を解釈できない。テストが
 * 見たいのは meta と登録の有無で、本文は描画しない。
 */
const mdxStub = {
  name: 'mdx-stub',
  enforce: 'pre' as const,
  load(id: string) {
    if (id.endsWith('.mdx')) return 'export default function MdxStub() { return null; }';
    return null;
  },
};

export default defineConfig({
  plugins: [mdxStub, react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'out', '.next', 'e2e'],
  },
});
