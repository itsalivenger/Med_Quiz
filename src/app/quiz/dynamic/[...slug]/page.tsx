'use client';

import { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import QuizEngine from '@/components/QuizEngine';
import { useQuizStore } from '@/store/useQuizStore';
import type { Question } from '@/lib/types';

// ── Mock AI question (replace with fetchDynamicQuestion) ──────
function mockAIQuestion(courseId: string, index: number): Question {
  return {
    id: `ai-${courseId}-${index}`,
    vignette: `[AI Generated] A 28-year-old patient presents to the clinic with findings related to the ${courseId} (AI question ${index}). Based on the embryological development and clinical anatomy, which of the following is the BEST answer?`,
    title_path: `Year 1 › Anatomy › ${courseId} · AI Mode`,
    source_citation: 'AI-Generated · Groq',
    options: [
      { letter: 'A', text: 'Distractor option A — plausible but incorrect.',             is_correct: false, explanation: 'This is a common distractor based on related anatomy.' },
      { letter: 'B', text: 'The correct AI-generated answer for this stem.',             is_correct: true,  explanation: 'This is the most accurate answer based on current anatomical knowledge.' },
      { letter: 'C', text: 'Distractor option C — confuses adjacent structures.',        is_correct: false, explanation: 'Students often confuse this with the adjacent structure.' },
      { letter: 'D', text: 'Distractor option D — reverses the anatomical relationship.',is_correct: false, explanation: 'The relationship is actually reversed here.' },
    ],
  };
}

export default function DynamicQuizPage() {
  const params   = useParams();
  const slug     = (params.slug as string[]) ?? [];
  const courseId = slug[slug.length - 1] ?? 'unknown';

  const { questions, setQuestions, isFinished, isSubmitted, currentIndex } = useQuizStore();

  // Seed the first batch
  useEffect(() => {
    setQuestions([mockAIQuestion(courseId, 1)]);
  }, [courseId, setQuestions]);

  // Append next AI question when the current one is submitted
  const appendNext = useCallback(() => {
    // In production: fetchDynamicQuestion(courseId, 1).then(qs => ...)
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
          <p className="text-sm">Generating question with AI…</p>
        </div>
      </div>
    );
  }

  return <QuizEngine />;
}
