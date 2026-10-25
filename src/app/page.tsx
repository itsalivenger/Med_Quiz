import QuickLauncher from '@/components/QuickLauncher';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedQuiz — Réussissez vos examens. Zéro distraction.',
  description: 'Accès immédiat aux annales de concours et cas cliniques générés par IA.',
};

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 pt-12 pb-16 text-center">
      <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-up">
        {/* En-tête épuré et percutant */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Réussissez vos examens.{' '}
            <span className="text-red-500">Zéro distraction.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Accès immédiat aux annales de concours et cas cliniques générés par IA.
          </p>
        </div>

        {/* Sélecteur de quiz instantané */}
        <div className="w-full">
          <QuickLauncher />
        </div>

        {/* Mention discrète */}
        <p className="text-xs text-zinc-500">
          Mode invité actif · Synchronisation locale · Aucune inscription requise
        </p>
      </div>
    </div>
  );
}
