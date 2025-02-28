import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center">
      <title>Error 404 | Page not Found</title>
      <div className="flex w-80 flex-col gap-4 rounded-2xl bg-gray-600 p-4 text-center text-xl shadow-[inset_0_0_4px_0] max-sm:w-4/5">
        <h1 className="text-3xl font-bold text-purple-600">ERRO 404</h1>
        <p className="text-gray-200">Página não encontrada</p>
        <Link href="/" className="text-purple-500 hover:text-purple-600">
          Ir para página inicial
        </Link>
      </div>
    </main>
  );
}
