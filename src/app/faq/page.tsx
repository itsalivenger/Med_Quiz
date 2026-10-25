'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'MedQuiz est-il entièrement gratuit ?',
    a: 'Oui — MedQuiz est 100% gratuit pour tous les étudiants en médecine (PASS, L.AS, externat). Vous pouvez démarrer immédiatement en mode invité sans carte bancaire ni création de compte obligatoire.',
  },
  {
    q: 'Dois-je créer un compte pour commencer à m\'entraîner ?',
    a: 'Non ! Le mode invité vous donne un accès instantané. Vos résultats et votre progression sont sauvegardés localement dans votre navigateur.',
  },
  {
    q: 'Quelle est la différence entre les modes "QCM Annales" et "Quiz IA" ?',
    a: 'Le mode Annales s\'appuie sur une base de questions de cours vérifiées et calibrées pour les examens. Le mode IA génère des cas cliniques inédits à l\'infini avec explications détaillées.',
  },
  {
    q: 'Quelle est la fiabilité des cas cliniques générés par l\'IA ?',
    a: 'Les questions IA sont générées à partir des référentiels des collèges médicaux avec justification item par item pour un entraînement d\'entraînement stimulant et formateur.',
  },
  {
    q: 'Puis-je identifier et cibler mes points faibles ?',
    a: 'Absolument — le tableau de bord affiche votre pourcentage de réussite par matière et met en évidence les notions à renforcer (score inférieur à 60%).',
  },
  {
    q: 'Mes données de révision sont-elles protégées ?',
    a: 'En mode invité, vos données restent strictement sur votre machine (localStorage). Aucune donnée personnelle n\'est collectée ni revendue.',
  },
] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#181818] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-800/40"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-800/80 bg-[#141414] px-5 py-4">
          <p className="text-sm leading-relaxed text-zinc-400">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">Foire Aux Questions</h1>
        <p className="mt-2 text-sm text-zinc-400">Tout ce que vous devez savoir pour réviser avec MedQuiz.</p>
      </div>
      <div className="flex flex-col gap-3">
        {FAQS.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>
    </div>
  );
}
