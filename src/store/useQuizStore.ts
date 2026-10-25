'use client';
// ─────────────────────────────────────────────────────────────
//  useQuizStore — active quiz session state (Zustand)
// ─────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { Question } from '@/lib/types';

interface QuizState {
  questions:    Question[];
  currentIndex: number;
  /** questionIndex → selected option letter */
  userAnswers:  Record<number, string>;
  isSubmitted:  boolean;
  score:        number;
  timerSeconds: number;
  isFinished:   boolean;

  setQuestions:   (qs: Question[]) => void;
  selectOption:   (letter: string) => void;
  submitAnswer:   () => void;
  nextQuestion:   () => void;
  resetQuiz:      () => void;
  tickTimer:      () => void;
}

const INITIAL: Omit<QuizState, keyof Omit<QuizState, 'questions'|'currentIndex'|'userAnswers'|'isSubmitted'|'score'|'timerSeconds'|'isFinished'>> = {
  questions:    [],
  currentIndex: 0,
  userAnswers:  {},
  isSubmitted:  false,
  score:        0,
  timerSeconds: 0,
  isFinished:   false,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...INITIAL,

  setQuestions(questions) {
    set({ ...INITIAL, questions });
  },

  selectOption(letter) {
    const { currentIndex, isSubmitted } = get();
    if (isSubmitted) return;
    set(s => ({ userAnswers: { ...s.userAnswers, [currentIndex]: letter } }));
  },

  submitAnswer() {
    const { questions, currentIndex, userAnswers, score } = get();
    const q       = questions[currentIndex];
    const selected = userAnswers[currentIndex];
    if (!q || !selected) return;
    const correct = q.options.find(o => o.is_correct)?.letter;
    set({ isSubmitted: true, score: selected === correct ? score + 1 : score });
  },

  nextQuestion() {
    const { currentIndex, questions } = get();
    const next = currentIndex + 1;
    if (next >= questions.length) set({ isFinished: true });
    else set({ currentIndex: next, isSubmitted: false });
  },

  resetQuiz() { set(INITIAL); },

  tickTimer() {
    set(s => {
      if (s.timerSeconds <= 0) return {};
      const next = s.timerSeconds - 1;
      if (next === 0 && !s.isSubmitted) {
        const q       = s.questions[s.currentIndex];
        const correct = q?.options.find(o => o.is_correct)?.letter;
        const selected = s.userAnswers[s.currentIndex];
        return { timerSeconds: 0, isSubmitted: true, score: selected === correct ? s.score + 1 : s.score };
      }
      return { timerSeconds: next };
    });
  },
}));
