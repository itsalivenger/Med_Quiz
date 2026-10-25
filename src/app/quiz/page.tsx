'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Zap, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
import { useQuizStore } from '@/store/useQuizStore';
import type { Question } from '@/lib/types';

function mockQuestionsForCourse(courseName: string, mode: 'static' | 'dynamic', count: number): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${courseName.toLowerCase()}-${mode}-q${i + 1}`,
    vignette:
      mode === 'dynamic'
        ? `[Cas Clinique IA #${i + 1}] Un patient de 42 ans consulte pour une symptomatologie aiguë en rapport avec le cours ${courseName}. L'examen met en évidence des anomalies sémiologiques ciblées. Concernant la démarche diagnostique et thérapeutique conforme aux référentiels, quelle affirmation est EXACTE ?`
        : `[Annales Officielles #${i + 1}] Parmi les propositions suivantes concernant ${courseName} (item d'examen), laquelle est EXACTE ?`,
    title_path: `Module Médical > ${courseName}`,
    source_citation:
      mode === 'dynamic'
        ? 'Collège Médical National & Modèle RAG Vérifié'
        : 'Annales Officielles des Concours Médicaux',
    options: [
      {
        letter: 'A',
        text: 'La proposition première présente un piège sémiologique classique éliminé à l\'interrogatoire.',
        is_correct: false,
        explanation: 'Faux. Cette caractéristique ne correspond pas aux critères diagnostiques majeurs.',
      },
      {
        letter: 'B',
        text: 'La proposition clinique exacte démontrée par les examens complémentaires de référence.',
        is_correct: true,
        explanation: 'Exact. C\'est la conduite à tenir préconisée par les recommandations de pratique clinique.',
      },
      {
        letter: 'C',
        text: 'L\'attitude attentiste sans surveillance biologique spécialisée est la règle.',
        is_correct: false,
        explanation: 'Faux. Un bilan de confirmation s\'avère systématiquement requis.',
      },
      {
        letter: 'D',
        text: 'Le traitement de première intention repose sur une contre-indication absolue dans ce contexte.',
        is_correct: false,
        explanation: 'Faux. Il existe un risque iatrogène formel documenté dans les référentiels.',
      },
      {
        letter: 'E',
        text: 'L\'évolution spontanée est constamment bénigne sans risque de récidive précoce.',
        is_correct: false,
        explanation: 'Faux. Une surveillance clinique étroite est indispensable.',
      },
    ],
  }));
}

function QuizLauncherContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const year = searchParams.get('year') || 'y1';
  const semester = searchParams.get('semester') || 's1';
  const matter = searchParams.get('matter') || 'm1';
  const course = searchParams.get('course') || 'c1';

  const [mode, setMode] = useState<'static' | 'dynamic'>('dynamic');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [started, setStarted] = useState(false);

  const { setQuestions } = useQuizStore();

  const handleStart = () => {
    const questions = mockQuestionsForCourse(`${matter}-${course}`, mode, questionCount);
    setQuestions(questions);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="w-full">
        <QuizEngine />
      </div>
    );
  }

  const formatBreadcrumb = () => {
    const yLabel = year === 'y1' ? '1ère Année' : `${year.replace('y', '')}e Année`;
    const sLabel = semester === 's1' ? 'Semestre 1' : 'Semestre 2';
    return `${yLabel} · ${sLabel} · Module sélectionné`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 animate-fade-up">
      {/* Retour navigation */}
      <div className="mb-6">
        <Link
          href="/selection"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Modifier la sélection du cours</span>
        </Link>
      </div>

      {/* Carte de configuration */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500">
            Prêt pour l&apos;entraînement
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Choisissez votre mode d&apos;exercice
          </h1>
          <p className="text-xs text-zinc-400">{formatBreadcrumb()}</p>
        </div>

        {/* Sélection du mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option Annales (Teal) */}
          <button
            type="button"
            onClick={() => setMode('static')}
            className={[
              'rounded-xl border p-4 text-left transition-all cursor-pointer relative overflow-hidden',
              mode === 'static'
                ? 'border-teal-500 bg-teal-950/20 shadow-lg shadow-teal-950/30 ring-1 ring-teal-500/50'
                : 'border-zinc-800 bg-[#111111] hover:border-zinc-700',
            ].join(' ')}
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className={`h-5 w-5 ${mode === 'static' ? 'text-teal-400' : 'text-zinc-500'}`} />
              <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/40 rounded px-1.5 py-0.5">
                Vérifié Collège
              </span>
            </div>
            <p className="font-bold text-white text-sm">QCM Annales</p>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Questions issues des banques de concours et examens pour cibler les pièges classiques.
            </p>
          </button>

          {/* Option IA (Crimson) */}
          <button
            type="button"
            onClick={() => setMode('dynamic')}
            className={[
              'rounded-xl border p-4 text-left transition-all cursor-pointer relative overflow-hidden',
              mode === 'dynamic'
                ? 'border-red-600 bg-red-950/20 shadow-lg shadow-red-950/30 ring-1 ring-red-600/50'
                : 'border-zinc-800 bg-[#111111] hover:border-zinc-700',
            ].join(' ')}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className={`h-5 w-5 ${mode === 'dynamic' ? 'text-red-500' : 'text-zinc-500'}`} />
              <span className="text-[10px] font-semibold text-red-400 bg-red-950/60 border border-red-900/40 rounded px-1.5 py-0.5">
                Cas Inédits
              </span>
            </div>
            <p className="font-bold text-white text-sm">Quiz Cas Cliniques IA</p>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Génération infinie de vignettes cliniques avec justification détaillée item par item.
            </p>
          </button>
        </div>

        {/* Nombre de questions */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Nombre de questions pour cette session
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 20].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={[
                  'rounded-xl border py-2.5 text-xs font-semibold transition-colors cursor-pointer',
                  questionCount === count
                    ? 'border-red-600 bg-red-600 text-white shadow-md'
                    : 'border-zinc-800 bg-[#111111] text-zinc-400 hover:text-white',
                ].join(' ')}
              >
                {count} QCM
              </button>
            ))}
          </div>
        </div>

        {/* Bouton de lancement */}
        <button
          type="button"
          onClick={handleStart}
          className={[
            'w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2',
            mode === 'dynamic'
              ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
              : 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/40',
          ].join(' ')}
        >
          <span>Lancer la session ({questionCount} questions)</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function QuizLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <QuizLauncherContent />
    </Suspense>
  );
}
