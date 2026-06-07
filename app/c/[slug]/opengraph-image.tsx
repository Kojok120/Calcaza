import { ImageResponse } from 'next/og';
import { getCalculator, getAllSlugs } from '@/calculators/registry';
import { SITE_NAME } from '@/lib/site';
import { CATEGORY_LABEL } from '@/lib/icons';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  const title = meta?.title ?? SITE_NAME;
  const description = meta?.description ?? '';
  const categoryLabel = meta ? CATEGORY_LABEL[meta.category] : 'Calculadora';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'linear-gradient(135deg, #1e2a78 0%, #2f4ac4 55%, #4f6dd9 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 10,
                fontSize: 26,
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              $
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.01em' }}>
              {SITE_NAME}
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.86)',
              lineHeight: 1.45,
              maxWidth: '92%',
            }}
          >
            {description.slice(0, 130)}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            color: 'rgba(255,255,255,0.86)',
          }}
        >
          <span>{SITE_NAME} · calcaza.com</span>
          <span style={{ letterSpacing: '0.04em' }}>
            Fontes oficiais · R$ · Português
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
