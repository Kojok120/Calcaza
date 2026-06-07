# brazcalc

Brazilian Portuguese (pt-BR) programmatic-SEO calculator site for Brazil. Public brand: **Calcaza** (`calcaza.com`). Forked from the `sacalculo`/Contazon (es-US) scaffold, itself sharing the `keisanya` (Japanese) / `alhasiba` (Arabic) / `matecalc` (AU English) base.

- Domain: `calcaza.com` — set via `NEXT_PUBLIC_SITE_URL`
- Display name: `Calcaza` — set via `NEXT_PUBLIC_SITE_NAME`
- Locale: pt-BR (Brazilian Portuguese, **not** pt-PT — use "você", `celular` not `telemóvel`), currency BRL (R$), dates dd/mm/yyyy, decimal comma
- Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS · MDX · Vitest · Playwright
- Hosting target: Cloudflare Pages (static export)

For agent / contributor rules see `CLAUDE.md`. The structured runtime context every PSEO agent loads is `docs/site-context.md`.

**Geographic scope**: Brazil federal (Receita Federal / INSS / Previdência / Caixa-FGTS / Ministério do Trabalho / TST / Banco Central / IBGE) + state SEFAZ where relevant (ICMS / IPVA). Portugal (Autoridade Tributária) and other Lusophone countries are explicitly **out of scope** — do not import pt-PT or Portuguese-tax figures into Brazilian calculators.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in real values
pnpm dev
```

## Scripts

- `pnpm dev` — local dev server
- `pnpm test` — Vitest unit tests (calculator logic)
- `pnpm test:e2e` — Playwright end-to-end tests
- `pnpm build` — static production build
- `pnpm lint` — ESLint

## Live calculators (1)

| Slug | Topic | Source |
|---|---|---|
| calculadora-salario-liquido | Salário líquido 2026 (INSS + IRRF + isenção Lei 15.270/2025) | gov.br/inss, Receita Federal 2026, planalto.gov.br |

Seed calculator. The roadmap (`docs/calculator-roadmap.md`) targets Brazil's core money/work queries next: rescisão (CLT), 13º salário, férias, horas extras, INSS, IRRF, FGTS, MEI/DAS, Simples Nacional. Each is built from a `.gov.br` primary source and cited on the page.

## Layout

```
app/                 Next.js routes (marketing pages, /c/[slug], /blog, sitemap, robots)
calculators/
  _template/         Copy this when adding a new calculator
  <slug>/            One directory per calculator (logic, test, meta, content, form, lede)
  registry.ts        Calculator registry (currently empty)
components/          Shared UI (Header, Footer, FAQ, CalculatorShell, ResultStat)
posts/               Blog/guide registry (currently empty)
docs/
  site-context.md    Locale rules, currency, source whitelist, title limits (pt-BR / BRL)
lib/
  site.ts            Brand / locale / currency (env-driven, defaults to Calcaza / pt-BR / BRL)
  editorial.ts       Editorial persona (Equipe Editorial da Calcaza) for E-E-A-T attribution
  jsonld.ts          WebApplication + FAQPage + BreadcrumbList builders (inLanguage: 'pt-BR')
  seo.ts             generateMetadata helper (title limit incl. brand suffix)
  format.ts          Currency / number / percent formatters (Intl-driven, pt-BR / BRL)
public/              Static assets
e2e/                 Playwright specs
```
