import QuickLauncher from '@/components/QuickLauncher';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedQuiz — Master Medical Exams. Zero Fluff.',
  description: 'Instant static board questions and AI-generated clinical vignettes.',
};

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 pt-12 pb-16 text-center">
      <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-up">
        {/* Stark, Clean Hero */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Master Medical Exams.{' '}
            <span className="text-red-500">Zero Fluff.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Instant board questions and AI clinical vignettes.
          </p>
        </div>

        {/* Quick-Launcher Widget */}
        <div className="w-full">
          <QuickLauncher />
        </div>

        {/* Sub-launcher info */}
        <p className="text-xs text-zinc-500">
          Guest mode active · Instant browser sync · No sign-up required
        </p>
      </div>
    </div>
  );
}
