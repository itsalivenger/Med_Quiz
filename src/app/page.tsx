import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedQuiz — Réussissez vos examens. Zéro distraction.',
  description: 'Accès immédiat aux annales de concours et cas cliniques générés par IA.',
};

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 pt-8 pb-16 text-center">
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-up">
        {/* En-tête épuré et percutant */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Maîtrisez vos examens.{' '}
            <span className="text-red-500">Zéro distraction.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Accès instantané aux annales de concours et cas cliniques générés par IA.
          </p>
        </div>

        {/* Bouton Unique de Redirection vers le flux de sélection */}
        <div className="pt-2">
          <Link
            href="/selection"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 text-base sm:text-lg transition-colors shadow-lg shadow-red-900/35 hover:shadow-red-900/50 active:scale-[0.98]"
          >
            Commencer l&apos;entraînement
          </Link>
        </div>

        {/* Mention discrète */}
        <p className="text-xs text-zinc-500">
          6 années médicales · Mode invité actif · Zéro inscription requise
        </p>
      </div>
    </div>
  );
}
