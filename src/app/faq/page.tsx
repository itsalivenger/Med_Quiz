'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';

const FAQS = [
  { q: 'Is MedQuiz completely free?',
    a: 'Yes — MedQuiz is free forever for all medical students. You can start quizzing in guest mode without even creating an account. A Pro tier with advanced analytics is coming soon.' },
  { q: 'Do I need to create an account to start?',
    a: 'No! Guest mode gives you instant access. Your progress is saved locally. Create a free account to sync your history across devices.' },
  { q: 'What is the difference between Static and AI Quiz modes?',
    a: 'Static mode uses a curated bank of reviewed questions tied to your specific course. AI mode generates infinite, fresh clinical vignettes using Groq — great for extra practice.' },
  { q: 'How accurate are the AI-generated questions?',
    a: 'AI questions are generated from course-specific context and reviewed for clinical accuracy. They include detailed explanations, but should complement (not replace) your primary resources.' },
  { q: 'Can I track my weak spots?',
    a: 'Absolutely — the Dashboard shows per-subject accuracy breakdowns and flags subjects below 60% for targeted review.' },
  { q: 'Is my quiz history stored securely?',
    a: 'Guest history is stored in your browser\'s localStorage. Authenticated accounts have history synced to our encrypted backend. We never share your data.' },
] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-700/60 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-800/40"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-700/40 bg-slate-900/40 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-400">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
        <p className="mt-2 text-sm text-slate-500">Everything you need to know about MedQuiz.</p>
      </div>
      <div className="flex flex-col gap-3">
        {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
      </div>
    </div>
  );
}
