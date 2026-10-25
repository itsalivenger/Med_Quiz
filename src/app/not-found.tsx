import Link from 'next/link';
import { ArrowLeft, Stethoscope, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-md space-y-6 animate-fade-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/20 text-red-500">
          <Stethoscope className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
            Erreur 404
          </span>
          <h1 className="text-3xl font-extrabold text-white">Diagnostic introuvable</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            La page ou la question clinique que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors shadow-lg shadow-red-900/30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <Link
            href="/selection"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#161616] hover:bg-zinc-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Choisir un cours</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
