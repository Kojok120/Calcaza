import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Inter } from 'next/font/google';
import {
  ADSENSE_CLIENT,
  CLOUDFLARE_ANALYTICS_TOKEN,
  GA4_ID,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SITE_DEFAULT_OG_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_DIR,
} from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_OG_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f2' },
    { media: '(prefers-color-scheme: dark)', color: '#141a26' },
  ],
};

const themeInitScript = `
(function() {
  try {
    var pref = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = pref ? pref === 'dark' : systemDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

const isPlaceholderAdsense = ADSENSE_CLIENT.includes('XXXX');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE_LANG}
      dir={SITE_DIR}
      className={`${inter.variable} ${ibmPlexSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {!isPlaceholderAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        {GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-surface-0 text-ink-1 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink-1 focus:px-3 focus:py-2 focus:text-sm focus:text-surface-0"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {CLOUDFLARE_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CLOUDFLARE_ANALYTICS_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
