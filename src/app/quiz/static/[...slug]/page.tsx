'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuizEngine from '@/components/QuizEngine';
import { useQuizStore } from '@/store/useQuizStore';
import type { Question } from '@/lib/types';

// ── Mock question generator (replace with fetchStaticQuestions) ──
function mockQuestions(courseId: string): Question[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${courseId}-q${i + 1}`,
    vignette: `A 34-year-old medical student is studying the ${courseId} for their upcoming anatomy practical (Question ${i + 1}). Which of the following statements is MOST accurate regarding its clinical significance?`,
    title_path: `Year 1 › Anatomy › Locomoteur › ${courseId}`,
    source_citation: `Anatomy Slide ${i + 12}`,
    options: [
      { letter: 'A', text: 'It articulates directly with the sternum via a synovial joint.',         is_correct: false, explanation: 'This describes the clavicle, not this structure.' },
      { letter: 'B', text: 'The correct anatomical answer for this question stem.',                   is_correct: true,  explanation: 'This is correct because it accurately describes the key anatomical feature.' },
      { letter: 'C', text: 'It is entirely intramembranous in its ossification pattern.',             is_correct: false, explanation: 'Incorrect — endochondral ossification is involved.' },
      { letter: 'D', text: 'The axillary nerve passes superior to this structure.',                   is_correct: false, explanation: 'The axillary nerve passes inferior, through the quadrangular space.' },
      { letter: 'E', text: 'It has no muscular attachments and serves as a pure bony landmark.',     is_correct: false, explanation: 'Several major muscles originate and insert on this structure.' },
    ],
  }));
}

export default function StaticQuizPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const slug         = (params.slug as string[]) ?? [];
  const courseId     = slug[slug.length - 1] ?? 'unknown';

  const { setQuestions, questions } = useQuizStore();

  useEffect(() => {
    // In production: fetchStaticQuestions(courseId).then(setQuestions)
    setQuestions(mockQuestions(courseId));
  }, [courseId, setQuestions]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <p className="text-sm">Loading questions…</p>
        </div>
      </div>
    );
  }

  return <QuizEngine />;
}
