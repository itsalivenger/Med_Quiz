'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Zap, BookOpen } from 'lucide-react';
import type { AcademicHierarchy } from '@/lib/types';

// ─── Hiérarchie Académique Médicale (Français) ────────────────────
export const MOCK_HIERARCHY: AcademicHierarchy = [
  {
    id: 'y1',
    name: '1ère Année (PASS/L.AS)',
    semesters: [
      {
        id: 'y1s1',
        name: 'Semestre 1',
        matters: [
          {
            id: 'y1s1-anat',
            name: 'Anatomie',
            subsections: [
              {
                id: 'y1s1-anat-loco',
                name: 'Appareil Locomoteur',
                courses: [
                  { id: 'scapula',  name: 'Scapula & Ceinture Scapulaire', question_count: 15 },
                  { id: 'humerus',  name: 'Humérus & Bras',               question_count: 12 },
                  { id: 'clavicle', name: 'Clavicule & Région Pectorale', question_count: 9  },
                ],
              },
              {
                id: 'y1s1-anat-neuro',
                name: 'Neuroanatomie',
                courses: [
                  { id: 'brainstem',  name: 'Tronc cérébral & Nerfs crâniens', question_count: 18 },
                  { id: 'cerebellum', name: 'Cervelet & Voies motrices',       question_count: 14 },
                ],
              },
            ],
          },
          {
            id: 'y1s1-bio',
            name: 'Biochimie',
            subsections: [
              {
                id: 'y1s1-bio-enz',
                name: 'Enzymologie',
                courses: [
                  { id: 'kinetics',   name: 'Cinétique Michaelienne', question_count: 11 },
                  { id: 'inhibition', name: 'Inhibitions Réversibles', question_count: 8 },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'y1s2',
        name: 'Semestre 2',
        matters: [
          {
            id: 'y1s2-physio',
            name: 'Physiologie',
            subsections: [
              {
                id: 'y1s2-physio-cardio',
                name: 'Physiologie Cardiovasculaire',
                courses: [
                  { id: 'cardiac-cycle', name: 'Cycle Cardiaque & Hémodynamique', question_count: 20 },
                  { id: 'ecg-basics',    name: 'Électrocardiogramme (ECG)',       question_count: 16 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'y2',
    name: '2ème Année (DFGSM 2)',
    semesters: [
      {
        id: 'y2s1',
        name: 'Semestre 1',
        matters: [
          {
            id: 'y2s1-path',
            name: 'Anatomopathologie',
            subsections: [
              {
                id: 'y2s1-path-gen',
                name: 'Pathologie Générale',
                courses: [
                  { id: 'inflammation', name: 'Inflammation Aiguë & Chronique', question_count: 22 },
                  { id: 'neoplasia',    name: 'Processus Tumoral & Métastases', question_count: 19 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Styled Select ────────────────────────────────────────────────
function StyledSelect({
  label,
  value,
  onChange,
  children,
  accentColor = 'red',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  accentColor?: 'red' | 'teal';
}) {
  const ring = accentColor === 'teal' ? 'focus:ring-teal-500' : 'focus:ring-red-600';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            'w-full appearance-none rounded-xl border border-zinc-800 bg-[#111111]',
            'p-3 pr-8 text-sm text-slate-200 outline-none transition-colors',
            'hover:border-zinc-700 focus:ring-1 cursor-pointer',
            ring,
          ].join(' ')}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  );
}

// ─── QuickLauncher ────────────────────────────────────────────────
interface QuickLauncherProps {
  hierarchy?: AcademicHierarchy;
}

export default function QuickLauncher({ hierarchy = MOCK_HIERARCHY }: QuickLauncherProps) {
  const router = useRouter();

  const [yearId, setYearId] = useState<string>('y1');
  const selectedYear = useMemo(
    () => hierarchy.find((y) => y.id === yearId) ?? hierarchy[0],
    [hierarchy, yearId]
  );

  const availableSemesters = useMemo(() => selectedYear?.semesters ?? [], [selectedYear]);
  const [semesterId, setSemesterId] = useState<string>('y1s1');
  const selectedSemester = useMemo(
    () => availableSemesters.find((s) => s.id === semesterId) ?? availableSemesters[0],
    [availableSemesters, semesterId]
  );

  const availableMatters = useMemo(() => selectedSemester?.matters ?? [], [selectedSemester]);
  const [matterId, setMatterId] = useState<string>('y1s1-anat');
  const selectedMatter = useMemo(
    () => availableMatters.find((m) => m.id === matterId) ?? availableMatters[0],
    [availableMatters, matterId]
  );

  const availableCourses = useMemo(
    () => selectedMatter?.subsections.flatMap((ss) => ss.courses) ?? [],
    [selectedMatter]
  );
  const [courseId, setCourseId] = useState<string>('scapula');

  const handleLaunch = useCallback(
    (mode: 'static' | 'dynamic') => {
      if (!selectedYear || !selectedSemester || !selectedMatter || !courseId) return;
      router.push(
        `/quiz/${mode}/${selectedYear.id}/${selectedSemester.id}/${selectedMatter.id}/${courseId}`
      );
    },
    [router, selectedYear, selectedSemester, selectedMatter, courseId]
  );

  return (
    <div className="w-full">
      <div className="bg-[#161616] border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">

        {/* ── 4 Dropdowns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <StyledSelect
            label="Année"
            value={yearId}
            onChange={(v) => {
              setYearId(v);
              const y = hierarchy.find((item) => item.id === v);
              const s = y?.semesters[0];
              setSemesterId(s?.id ?? '');
              const m = s?.matters[0];
              setMatterId(m?.id ?? '');
              setCourseId(m?.subsections[0]?.courses[0]?.id ?? '');
            }}
          >
            {hierarchy.map((y) => (
              <option key={y.id} value={y.id} className="bg-[#111111] text-slate-200">{y.name}</option>
            ))}
          </StyledSelect>

          <StyledSelect
            label="Semestre"
            value={semesterId}
            onChange={(v) => {
              setSemesterId(v);
              const s = availableSemesters.find((sem) => sem.id === v);
              const m = s?.matters[0];
              setMatterId(m?.id ?? '');
              setCourseId(m?.subsections[0]?.courses[0]?.id ?? '');
            }}
          >
            {availableSemesters.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#111111] text-slate-200">{s.name}</option>
            ))}
          </StyledSelect>

          <StyledSelect
            label="Matière"
            value={matterId}
            onChange={(v) => {
              setMatterId(v);
              const m = availableMatters.find((mat) => mat.id === v);
              setCourseId(m?.subsections[0]?.courses[0]?.id ?? '');
            }}
          >
            {availableMatters.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#111111] text-slate-200">{m.name}</option>
            ))}
          </StyledSelect>

          <StyledSelect
            label="Cours / Sujet"
            value={courseId}
            onChange={setCourseId}
          >
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#111111] text-slate-200">
                {c.name} ({c.question_count} QCM)
              </option>
            ))}
          </StyledSelect>
        </div>

        {/* ── Dual CTAs ── */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">

          {/* Static Board Quiz — Teal */}
          <button
            type="button"
            onClick={() => handleLaunch('static')}
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(13,148,136,0.30)] transition-all duration-150 text-sm"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            QCM Annales
          </button>

          {/* AI Quiz — Crimson */}
          <button
            type="button"
            onClick={() => handleLaunch('dynamic')}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.35)] transition-all duration-150 text-sm"
          >
            <Zap className="h-4 w-4 shrink-0" />
            Lancer Quiz IA
          </button>

        </div>
      </div>
    </div>
  );
}
