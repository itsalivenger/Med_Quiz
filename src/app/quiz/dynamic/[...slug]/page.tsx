'use client';

import { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import QuizEngine from '@/components/QuizEngine';
import { useQuizStore } from '@/store/useQuizStore';
import type { Question } from '@/lib/types';

// ─── Génération de cas clinique IA en Français ───────────────────
function mockAIQuestion(courseId: string, index: number): Question {
  return {
    id: `ai-${courseId}-${index}`,
    vignette: `[Génération IA - Groq] Un patient de 28 ans consulte pour des douleurs mécaniques associées à la région anatomique : ${courseId} (Question IA n°${index}). En tenant compte du développement embryologique et des rapports musculo-nerveux, quelle est la proposition EXACTE ?`,
    title_path: `1ère Année > Anatomie > ${courseId} · Mode IA`,
    source_citation: 'Synthèse IA Médicale · Référentiel Collèges',
    options: [
      {
        letter: 'A',
        text: 'Distracteur A — proposition fréquente mais erronée liée aux structures adjacentes.',
        is_correct: false,
        explanation: 'Faux. Ce piège classique confond cette structure avec l\'innervation du groupe musculaire voisin.',
      },
      {
        letter: 'B',
        text: 'La proposition anatomique et thérapeutique exacte formulée pour ce cas clinique.',
        is_correct: true,
        explanation: 'Exact. Il s\'agit de la relation anatomique correcte et de la conduite à tenir recommandée.',
      },
      {
        letter: 'C',
        text: 'Distracteur C — inverse les rapports vasculaires antéro-postérieurs.',
        is_correct: false,
        explanation: 'Faux. Le trajet vasculo-nerveux chemine en réalité en position rétro-musculaire.',
      },
      {
        letter: 'D',
        text: 'Distracteur D — associe un mécanisme lésionnel incompatible avec la clinique.',
        is_correct: false,
        explanation: 'Faux. Cette complication survient lors d\'un traumatisme à haute cinétique différent.',
      },
    ],
  };
}

export default function DynamicQuizPage() {
  const params   = useParams();
  const slug     = (params.slug as string[]) ?? [];
  const courseId = slug[slug.length - 1] ?? 'scapula';

  const { questions, setQuestions, isFinished, isSubmitted, currentIndex } = useQuizStore();

  // Initialisation de la première question
  useEffect(() => {
    setQuestions([mockAIQuestion(courseId, 1)]);
  }, [courseId, setQuestions]);

  // Ajout de la question suivante générée au fil de l'eau
  const appendNext = useCallback(() => {
    // En production : fetchDynamicQuestion(courseId, 1).then(qs => ...)
    setQuestions([...questions, mockAIQuestion(courseId, questions.length + 1)]);
  }, [courseId, questions, setQuestions]);

  useEffect(() => {
    if (isSubmitted && currentIndex === questions.length - 1 && !isFinished) {
      appendNext();
    }
  }, [isSubmitted, currentIndex, questions.length, isFinished, appendNext]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <p className="text-sm">Génération du cas clinique par l&apos;IA…</p>
        </div>
      </div>
    );
  }

  return <QuizEngine />;
}
