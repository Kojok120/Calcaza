import Link from 'next/link';

type Item = { name: string; href?: string };

export function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-xs text-ink-3">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {it.href ? (
              <Link href={it.href} className="hover:text-ink-1 hover:underline">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {it.name}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
