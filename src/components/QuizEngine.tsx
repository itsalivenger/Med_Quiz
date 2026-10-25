'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, CheckCircle2, XCircle, Clock, BookOpen, RotateCcw } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';

// ─── Time Formatter ───────────────────────────────────────────────
function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Option Card Component ────────────────────────────────────────
interface OptionCardProps {
  letter: string;
  text: string;
  selected: boolean;
  isSubmitted: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  explanation?: string;
  onClick: () => void;
}

function OptionCard({
  letter,
  text,
  selected,
  isSubmitted,
  isCorrect,
  isWrong,
  explanation,
  onClick,
}: OptionCardProps) {
  let cardStyles =
    'bg-[#161616] border-zinc-800 hover:border-red-600/50 text-slate-200';
  let badgeStyles = 'bg-zinc-800 text-slate-300 border-zinc-700';

  if (isSubmitted) {
    if (isCorrect) {
      cardStyles = 'border-emerald-500 bg-emerald-950/20 text-emerald-300';
      badgeStyles = 'bg-emerald-600 text-white border-emerald-500';
    } else if (isWrong) {
      cardStyles = 'border-red-600 bg-red-950/40 text-red-300';
      badgeStyles = 'bg-red-600 text-white border-red-500';
    } else {
      cardStyles = 'border-zinc-800/60 bg-[#141414] text-zinc-500 opacity-60';
      badgeStyles = 'bg-zinc-900 text-zinc-600 border-zinc-800';
    }
  } else if (selected) {
    cardStyles = 'border-red-600 bg-red-950/20 text-white';
    badgeStyles = 'bg-red-600 text-white border-red-500 font-bold';
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={isSubmitted}
        className={[
          'group relative flex w-full cursor-pointer items-start gap-3.5 rounded-xl border p-4 text-left transition-colors outline-none',
          cardStyles,
          isSubmitted ? 'cursor-default' : 'active:scale-[0.99]',
        ].join(' ')}
      >
        <span
          className={[
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold border transition-colors',
            badgeStyles,
          ].join(' ')}
        >
          {letter}
        </span>

        <span className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
          {text}
        </span>

        {isSubmitted && (
          <span className="shrink-0 pt-0.5">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : isWrong ? (
              <XCircle className="h-5 w-5 text-red-400" />
            ) : null}
          </span>
        )}
      </button>

      {/* Per-option rationale reveal */}
      {isSubmitted && (isCorrect || isWrong) && explanation && (
        <div
          className={[
            'ml-10 rounded-lg px-3 py-1.5 text-xs leading-relaxed animate-fade-in',
            isCorrect
              ? 'bg-emerald-950/20 text-emerald-400 border-l border-emerald-500'
              : 'bg-red-950/20 text-red-400 border-l border-red-600',
          ].join(' ')}
        >
          {explanation}
        </div>
      )}
    </div>
  );
}

// ─── Main QuizEngine Component ────────────────────────────────────
export default function QuizEngine() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    questions,
    currentIndex,
    userAnswers,
    isSubmitted,
    score,
    timerSeconds,
    isFinished,
    selectOption,
    submitAnswer,
    nextQuestion,
    tickTimer,
    resetQuiz,
  } = useQuizStore();

  // Timer Tick
  useEffect(() => {
    if (timerSeconds > 0 && !isSubmitted && !isFinished) {
      timerRef.current = setInterval(tickTimer, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerSeconds, isSubmitted, isFinished, tickTimer]);

  const q = questions[currentIndex];
  const selected = userAnswers[currentIndex] ?? '';
  const totalQ = questions.length;
  const progress = totalQ > 0 ? ((currentIndex + (isSubmitted ? 1 : 0)) / totalQ) * 100 : 0;
  const isTimeLow = timerSeconds > 0 && timerSeconds <= 15;

  const handleSubmit = useCallback(() => {
    if (!selected || isSubmitted) return;
    submitAnswer();
  }, [selected, isSubmitted, submitAnswer]);

  // Keyboard Shortcuts (A-E, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        const optionExists = q?.options.some((o) => o.letter === key);
        if (optionExists && !isSubmitted) {
          selectOption(key);
        }
      } else if (e.key === 'Enter') {
        if (!isSubmitted && selected) {
          handleSubmit();
        } else if (isSubmitted) {
          nextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [q, isSubmitted, selected, selectOption, handleSubmit, nextQuestion]);

  // ── Finished Screen: Clean & Minimal (Zero Emojis) ──────────────
  if (isFinished || (!q && questions.length > 0)) {
    const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    return (
      <div className="mx-auto w-full max-w-xl px-4 pt-10 sm:pt-14 pb-16 animate-fade-up text-center">
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-white">
              {score}/{totalQ} Correct
            </h2>
            <p className="text-sm font-medium text-red-500">{percentage}% Accuracy</p>
          </div>

          <p className="text-sm text-zinc-400">
            {percentage >= 70
              ? 'Great job. Target concepts retained.'
              : 'Review missed questions to solidify understanding.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => {
                resetQuiz();
                router.push('/catalog');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-red-900/30"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Fallback ──────────────────────────────────────────────
  if (!q) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-zinc-500 text-sm">No questions in buffer.</p>
        <button
          type="button"
          onClick={() => router.push('/catalog')}
          className="text-xs text-red-500 hover:underline"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const breadcrumbText = q.title_path
    ? q.title_path.replace(/›/g, '>').replace(/·/g, '>')
    : 'Clinical Vignette';

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-8 sm:pt-10 pb-16 animate-fade-up">
      {/* ── Top Bar ── */}
      <div className="mb-4 flex items-center justify-between gap-3 text-xs">
        <p className="truncate text-zinc-400 font-medium" title={breadcrumbText}>
          {breadcrumbText}
        </p>

        <div className="flex items-center gap-3 shrink-0">
          {timerSeconds > 0 && (
            <span
              className={[
                'flex items-center gap-1 font-mono font-medium',
                isTimeLow ? 'text-red-500 animate-pulse' : 'text-zinc-400',
              ].join(' ')}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timerSeconds)}
            </span>
          )}

          <button
            type="button"
            onClick={() => router.push('/catalog')}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Exit"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Top Progress: Thin Crimson Progress Bar (bg-red-600 h-1 rounded-full) ── */}
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="progress-fill h-full bg-red-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Clinical Vignette Card (bg-[#161616] border border-zinc-800/80 p-6 rounded-2xl) ── */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#161616] p-6 shadow-xl mb-5">
        <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
          {q.vignette}
        </p>
      </div>

      {/* ── Options Grid (A, B, C, D) ── */}
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt) => (
          <OptionCard
            key={opt.letter}
            letter={opt.letter}
            text={opt.text}
            explanation={opt.explanation}
            selected={selected === opt.letter}
            isSubmitted={isSubmitted}
            isCorrect={isSubmitted && opt.is_correct}
            isWrong={isSubmitted && selected === opt.letter && !opt.is_correct}
            onClick={() => selectOption(opt.letter)}
          />
        ))}
      </div>

      {/* ── Explanation Drawer ── */}
      {isSubmitted && (
        <div className="mt-5 rounded-xl border border-zinc-800 bg-[#161616] p-5 animate-fade-in space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800/80">
            <span className="font-semibold text-slate-200">Explanation & Rationale</span>
            {q.source_citation && (
              <span className="flex items-center gap-1 text-zinc-500">
                <BookOpen className="h-3 w-3" />
                {q.source_citation}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {q.options.find((o) => o.is_correct)?.explanation ??
              'Review the relevant pathophysiology and clinical signs.'}
          </p>
        </div>
      )}

      {/* ── Action Bar: No Emojis on Any Buttons ── */}
      <div className="mt-6 flex items-center justify-between pt-3 border-t border-zinc-800/60">
        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          Shortcuts: <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-[10px]">A</kbd>–
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-[10px]">D</kbd>,{' '}
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-[10px]">Enter</kbd>
        </span>

        <div className="ml-auto">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected}
              className={[
                'rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors',
                selected
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed',
              ].join(' ')}
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-red-900/30"
            >
              <span>{currentIndex + 1 < totalQ ? 'Next Question' : 'See Results'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
