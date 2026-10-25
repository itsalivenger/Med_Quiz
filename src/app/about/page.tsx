import Link from 'next/link';
import { ShieldCheck, BookOpen, Cpu, Target, Award, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de MedQuiz',
  description: 'Notre mission : offrir aux étudiants en médecine un entraînement clinique d’excellence, rapide et sans distraction.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 space-y-12 animate-fade-in text-slate-100">
      {/* En-tête */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
          <Award className="h-3.5 w-3.5 text-red-500" />
          <span>Excellence Médicale</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Réussir ses examens.{' '}
          <span className="text-red-500">Zéro friction.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          MedQuiz est né d’un constat simple : les étudiants en médecine perdent trop de temps sur des interfaces lentes, encombrées et payantes.
        </p>
      </div>

      {/* 3 piliers fondateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-900/40">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Minimalisme Radical</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pas de fioritures, pas de publicités, pas d&apos;émojis distrayants. Un canvas sombre #111111 haute lisibilité conçu pour de longues sessions nocturnes de révision.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-800/40">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Référentiels des Collèges</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Chaque item d&apos;annales s&apos;appuie sur les ouvrages officiels des collèges nationaux d&apos;enseignants pour garantir une conformité absolue aux concours EDN et examens facultaires.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-900/40">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Intelligence Artificielle Clinique</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Notre moteur RAG simule des cas cliniques inédits à la demande et justifie chaque proposition d&apos;élimination pour forger un diagnostic réflexe.
          </p>
        </div>
      </div>

      {/* Engagement éthique et gratuité */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-400" />
          <span>Notre Engagement envers les Étudiants</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          L&apos;accès à l&apos;entraînement médical de qualité ne devrait pas dépendre de barrières financières. MedQuiz propose un mode invité immédiat et un accès universel sans engagement.
        </p>
        <div className="pt-2">
          <Link
            href="/selection"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors shadow-lg shadow-red-900/30"
          >
            <span>Démarrer l&apos;entraînement</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
