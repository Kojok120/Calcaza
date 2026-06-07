import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-3 text-ink-2">
        Confira o endereço (URL) ou volte ao início para encontrar uma calculadora.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-brand-500 px-6 text-white hover:bg-brand-600"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
