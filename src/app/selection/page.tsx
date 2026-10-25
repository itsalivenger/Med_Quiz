'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────────── */

const YEARS = [
  { id: 'y1', label: '1ère Année', sub: 'Tronc commun' },
  { id: 'y2', label: '2ème Année', sub: 'Sciences fondamentales' },
  { id: 'y3', label: '3ème Année', sub: 'Physiopathologie' },
  { id: 'y4', label: '4ème Année', sub: 'Clinique & Pathologie' },
  { id: 'y5', label: '5ème Année', sub: 'Stage hospitalier' },
  { id: 'y6', label: '6ème Année', sub: 'Internat & Résidanat' },
];

const SEMESTERS = [
  { id: 's1', label: 'Semestre 1', sub: 'Octobre → Février' },
  { id: 's2', label: 'Semestre 2', sub: 'Mars → Juillet' },
];

const MATTERS: Record<string, { id: string; label: string; sub: string }[]> = {
  y1: [
    { id: 'm1', label: 'Anatomie', sub: 'Structures & topographie' },
    { id: 'm2', label: 'Histologie', sub: 'Microstructure tissulaire' },
    { id: 'm3', label: 'Biochimie', sub: 'Métabolisme & enzymologie' },
    { id: 'm4', label: 'Biophysique', sub: 'Physiologie physique' },
    { id: 'm5', label: 'Physiologie', sub: 'Fonctionnement du corps' },
    { id: 'm6', label: 'Génétique', sub: 'Hérédité & ADN' },
  ],
  y2: [
    { id: 'm1', label: 'Anatomie II', sub: 'Neuro-anatomie' },
    { id: 'm2', label: 'Microbiologie', sub: 'Bactéries & virus' },
    { id: 'm3', label: 'Immunologie', sub: 'Système immunitaire' },
    { id: 'm4', label: 'Pharmacologie', sub: 'Médicaments & récepteurs' },
    { id: 'm5', label: 'Parasitologie', sub: 'Parasites & infections' },
    { id: 'm6', label: 'Embryologie', sub: 'Développement humain' },
  ],
  y3: [
    { id: 'm1', label: 'Cardiologie', sub: 'Coeur & vaisseaux' },
    { id: 'm2', label: 'Pneumologie', sub: 'Poumons & respiration' },
    { id: 'm3', label: 'Neurologie', sub: 'Système nerveux' },
    { id: 'm4', label: 'Gastro-entérologie', sub: 'Tube digestif' },
    { id: 'm5', label: 'Endocrinologie', sub: 'Hormones & glandes' },
    { id: 'm6', label: 'Rhumatologie', sub: 'Os, muscles & articulations' },
  ],
  y4: [
    { id: 'm1', label: 'Médecine Interne', sub: 'Pathologies systémiques' },
    { id: 'm2', label: 'Chirurgie Générale', sub: 'Techniques opératoires' },
    { id: 'm3', label: 'Pédiatrie', sub: 'Médecine de l enfant' },
    { id: 'm4', label: 'Gynécologie', sub: 'Santé féminine' },
    { id: 'm5', label: 'Dermatologie', sub: 'Maladies cutanées' },
    { id: 'm6', label: 'Psychiatrie', sub: 'Santé mentale' },
  ],
  y5: [
    { id: 'm1', label: 'Urgences', sub: 'Médecine urgence' },
    { id: 'm2', label: 'Réanimation', sub: 'Soins critiques' },
    { id: 'm3', label: 'Ophtalmologie', sub: 'Maladies des yeux' },
    { id: 'm4', label: 'ORL', sub: 'Oreille, nez, gorge' },
    { id: 'm5', label: 'Urologie', sub: 'Appareil urinaire' },
    { id: 'm6', label: 'Orthopédie', sub: 'Chirurgie osseuse' },
  ],
  y6: [
    { id: 'm1', label: 'Médecine du travail', sub: 'Pathologies professionnelles' },
    { id: 'm2', label: 'Médecine légale', sub: 'Expertise médico-légale' },
    { id: 'm3', label: 'Santé publique', sub: 'Épidémiologie & prévention' },
    { id: 'm4', label: 'Neurochirurgie', sub: 'Chirurgie du système nerveux' },
    { id: 'm5', label: 'Oncologie', sub: 'Cancérologie clinique' },
    { id: 'm6', label: 'Infectiologie', sub: 'Maladies infectieuses' },
  ],
};

const DEFAULT_COURSES = [
  { id: 'c1', label: 'Cours 1', sub: 'Introduction & bases' },
  { id: 'c2', label: 'Cours 2', sub: 'Approfondissement' },
  { id: 'c3', label: 'Cours 3', sub: 'Cas cliniques & annales' },
];

/* ──────────────────────────────────────────────────────────────────
   TYPES & STEPS
────────────────────────────────────────────────────────────────── */

type Step = 'year' | 'semester' | 'matter' | 'course';
const STEPS: Step[] = ['year', 'semester', 'matter', 'course'];

const STEP_LABELS: Record<Step, string> = {
  year: 'Année',
  semester: 'Semestre',
  matter: 'Matière',
  course: 'Cours',
};

const STEP_QUESTIONS: Record<Step, string> = {
  year: 'Quelle année étudiez-vous ?',
  semester: 'Quel semestre ?',
  matter: 'Quelle matière ?',
  course: 'Quel cours ?',
};

/* ──────────────────────────────────────────────────────────────────
   OPTION CARD
────────────────────────────────────────────────────────────────── */

function OptionCard({
  label,
  sub,
  delay,
  onClick,
}: {
  label: string;
  sub: string;
  delay: number;
  onClick: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      className={[
        'group relative w-full text-left rounded-xl border border-zinc-800/80',
        'bg-[#181818] hover:bg-[#1f1f1f] hover:border-red-600/50',
        'px-5 py-4 cursor-pointer',
        'transition-all duration-300',
        'active:scale-[0.98]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      ].join(' ')}
    >
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-r-full bg-red-600 group-hover:h-2/3 transition-all duration-300"
        aria-hidden="true"
      />
      <p className="font-semibold text-white text-sm sm:text-base leading-snug">{label}</p>
      <p className="mt-0.5 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{sub}</p>
      <ChevronLeft
        size={14}
        strokeWidth={2.5}
        className="absolute right-4 top-1/2 -translate-y-1/2 rotate-180 text-zinc-700 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all duration-200"
      />
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */

export default function SelectionPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>('year');
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedMatter, setSelectedMatter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 30);
    return () => clearTimeout(t);
  }, []);

  const transitionTo = useCallback((nextStep: Step) => {
    setPhase('exit');
    setTimeout(() => {
      setCurrentStep(nextStep);
      setPhase('enter');
      requestAnimationFrame(() => setTimeout(() => setPhase('visible'), 30));
    }, 260);
  }, []);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx === 0) { router.push('/'); return; }
    transitionTo(STEPS[idx - 1]);
  }, [currentStep, router, transitionTo]);

  const handleSelect = (id: string) => {
    switch (currentStep) {
      case 'year':
        setSelectedYear(id);
        transitionTo('semester');
        break;
      case 'semester':
        setSelectedSemester(id);
        transitionTo('matter');
        break;
      case 'matter':
        setSelectedMatter(id);
        transitionTo('course');
        break;
      case 'course':
        router.push(
          '/quiz?year=' + (selectedYear ?? '') +
          '&semester=' + (selectedSemester ?? '') +
          '&matter=' + (selectedMatter ?? '') +
          '&course=' + id
        );
        break;
    }
  };

  const items = (() => {
    switch (currentStep) {
      case 'year':     return YEARS;
      case 'semester': return SEMESTERS;
      case 'matter':   return MATTERS[selectedYear ?? 'y1'] ?? MATTERS['y1'];
      case 'course':   return DEFAULT_COURSES;
    }
  })();

  const stepIndex = STEPS.indexOf(currentStep);

  const breadcrumb = [
    selectedYear ? YEARS.find((y) => y.id === selectedYear)?.label : null,
    selectedSemester ? SEMESTERS.find((s) => s.id === selectedSemester)?.label : null,
    selectedMatter && currentStep === 'course'
      ? (MATTERS[selectedYear ?? 'y1'] ?? []).find((m) => m.id === selectedMatter)?.label
      : null,
  ].filter((x): x is string => Boolean(x));

  const phaseClass =
    phase === 'enter'
      ? 'opacity-0 translate-y-5'
      : phase === 'visible'
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-4';

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center px-4 pt-10 pb-20">
      {/* Back & breadcrumb */}
      <div className="w-full max-w-3xl mb-8 flex items-center gap-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Retour
        </button>
        {breadcrumb.length > 0 && (
          <>
            <span className="text-zinc-700 text-sm">·</span>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500 flex-wrap">
              {breadcrumb.map((label, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span>{label}</span>
                  {i < breadcrumb.length - 1 && <span className="text-zinc-700">/</span>}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Step content */}
      <div
        className={'w-full max-w-3xl transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] ' + phaseClass}
      >
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={
                  'rounded-full transition-all duration-300 ' +
                  (i < stepIndex
                    ? 'w-2 h-2 bg-red-500'
                    : i === stepIndex
                    ? 'w-2.5 h-2.5 bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.7)]'
                    : 'w-2 h-2 bg-zinc-700')
                }
              />
              {i < STEPS.length - 1 && (
                <div
                  className={'h-px w-8 transition-all duration-300 ' + (i < stepIndex ? 'bg-red-500/60' : 'bg-zinc-700')}
                />
              )}
            </div>
          ))}
          <span className="ml-2 text-xs text-zinc-500 font-mono">{stepIndex + 1} / {STEPS.length}</span>
        </div>

        {/* Step label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-2">
          {STEP_LABELS[currentStep]}
        </p>

        {/* Question heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight">
          {STEP_QUESTIONS[currentStep]}
        </h1>

        {/* Option grid */}
        <div
          className={
            'grid gap-3 ' +
            (items.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-md'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
          }
        >
          {items.map((item, i) => (
            <OptionCard
              key={item.id}
              label={item.label}
              sub={item.sub}
              delay={i * 40}
              onClick={() => handleSelect(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
