'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuizEngine from '@/components/QuizEngine';
import { useQuizStore } from '@/store/useQuizStore';
import type { Question } from '@/lib/types';

// ─── Générateur de questions mockées en Français ──────────────────
function mockQuestions(courseId: string): Question[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${courseId}-q${i + 1}`,
    vignette: `Un patient de 34 ans consulte aux urgences suite à un traumatisme fermé de l'épaule droite. L'examen clinique et le bilan radiologique portent sur la région de : ${courseId} (Question ${i + 1}). Parmi les propositions suivantes concernant les rapports anatomiques et la sémiologie, laquelle est EXACTE ?`,
    title_path: `1ère Année > Anatomie > Appareil Locomoteur > ${courseId}`,
    source_citation: `Collège Médical d'Anatomie · Item ${i + 15}`,
    options: [
      {
        letter: 'A',
        text: 'L\'articulation sterno-costo-claviculaire est la seule liaison osseuse unissant le membre supérieur au thorax.',
        is_correct: false,
        explanation: 'Faux. Cette proposition décrit spécifiquement la clavicule et ses articulations axiales.',
      },
      {
        letter: 'B',
        text: 'La proposition anatomique et clinique exacte décrivant précisément cette structure.',
        is_correct: true,
        explanation: 'Exact. C\'est la notion fondamentale retenue au concours pour ce repère anatomique.',
      },
      {
        letter: 'C',
        text: 'L\'ossification de cette structure est exclusivement de type endoconjonctive.',
        is_correct: false,
        explanation: 'Faux. L\'ossification implique un processus endochondral classique pour ce type de pièce osseuse.',
      },
      {
        letter: 'D',
        text: 'Le nerf axillaire chemine au bord supérieur immédiat de cette structure.',
        is_correct: false,
        explanation: 'Faux. Le nerf axillaire passe dans l\'espace axillaire latéral (quadrilatère de Velpeau) sous l\'articulation.',
      },
      {
        letter: 'E',
        text: 'Aucune insertion musculaire ne s\'y attache, s\'agissant d\'un simple relais ligamentaire.',
        is_correct: false,
        explanation: 'Faux. Plusieurs muscles majeurs de la coiffe des rotateurs et de la ceinture scapulaire y prennent insertion.',
      },
    ],
  }));
}

export default function StaticQuizPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const slug         = (params.slug as string[]) ?? [];
  const courseId     = slug[slug.length - 1] ?? 'scapula';

  const { setQuestions, questions } = useQuizStore();

  useEffect(() => {
    // En production : fetchStaticQuestions(courseId).then(setQuestions)
    setQuestions(mockQuestions(courseId));
  }, [courseId, setQuestions]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <p className="text-sm">Chargement des QCM…</p>
        </div>
      </div>
    );
  }

  return <QuizEngine />;
}
