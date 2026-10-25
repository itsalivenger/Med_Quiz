'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
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
                  { id: 'brainstem', name: 'Tronc cérébral & Nerfs crâniens', question_count: 18 },
                  { id: 'cerebellum',name: 'Cervelet & Voies motrices',       question_count: 14 },
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

interface QuickLauncherProps {
  hierarchy?: AcademicHierarchy;
}

export default function QuickLauncher({ hierarchy = MOCK_HIERARCHY }: QuickLauncherProps) {
  const router = useRouter();

  // 1. Année
  const [yearId, setYearId] = useState<string>('y1');
  const selectedYear = useMemo(
    () => hierarchy.find((y) => y.id === yearId) ?? hierarchy[0],
    [hierarchy, yearId]
  );

  // 2. Semestre
  const availableSemesters = useMemo(
    () => selectedYear?.semesters ?? [],
    [selectedYear]
  );
  const [semesterId, setSemesterId] = useState<string>('y1s1');
  const selectedSemester = useMemo(
    () => availableSemesters.find((s) => s.id === semesterId) ?? availableSemesters[0],
    [availableSemesters, semesterId]
  );

  // 3. Matière
  const availableMatters = useMemo(
    () => selectedSemester?.matters ?? [],
    [selectedSemester]
  );
  const [matterId, setMatterId] = useState<string>('y1s1-anat');
  const selectedMatter = useMemo(
    () => availableMatters.find((m) => m.id === matterId) ?? availableMatters[0],
    [availableMatters, matterId]
  );

  // 4. Cours / Sujet
  const availableCourses = useMemo(
    () => selectedMatter?.subsections.flatMap((ss) => ss.courses) ?? [],
    [selectedMatter]
  );
  const [courseId, setCourseId] = useState<string>('scapula');

  // Lancement (aucun emoji sur les boutons)
  const handleLaunch = useCallback(
    (mode: 'static' | 'dynamic') => {
      if (!selectedYear || !selectedSemester || !selectedMatter || !courseId) return;
      router.push(`/quiz/${mode}/${selectedYear.id}/${selectedSemester.id}/${selectedMatter.id}/${courseId}`);
    },
    [router, selectedYear, selectedSemester, selectedMatter, courseId]
  );

  return (
    <div className="w-full">
      {/* ── Conteneur épuré ── */}
      <div className="bg-[#161616]/90 backdrop-blur-xl border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
        {/* 4 Menus Déroulants Horizontaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {/* Menu 1: Année */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Année
            </label>
            <div className="relative">
              <select
                value={yearId}
                onChange={(e) => {
                  const newYId = e.target.value;
                  setYearId(newYId);
                  const y = hierarchy.find((item) => item.id === newYId);
                  const firstSem = y?.semesters[0];
                  setSemesterId(firstSem?.id ?? '');
                  const firstMatter = firstSem?.matters[0];
                  setMatterId(firstMatter?.id ?? '');
                  const firstCourse = firstMatter?.subsections[0]?.courses[0];
                  setCourseId(firstCourse?.id ?? '');
                }}
                className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#111111] p-3 pr-8 text-sm text-slate-200 outline-none transition-colors hover:border-zinc-700 focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                {hierarchy.map((y) => (
                  <option key={y.id} value={y.id} className="bg-[#111111] text-slate-200">
                    {y.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Menu 2: Semestre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Semestre
            </label>
            <div className="relative">
              <select
                value={semesterId}
                onChange={(e) => {
                  const newSemId = e.target.value;
                  setSemesterId(newSemId);
                  const sem = availableSemesters.find((s) => s.id === newSemId);
                  const firstMatter = sem?.matters[0];
                  setMatterId(firstMatter?.id ?? '');
                  const firstCourse = firstMatter?.subsections[0]?.courses[0];
                  setCourseId(firstCourse?.id ?? '');
                }}
                className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#111111] p-3 pr-8 text-sm text-slate-200 outline-none transition-colors hover:border-zinc-700 focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                {availableSemesters.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#111111] text-slate-200">
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Menu 3: Matière */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Matière
            </label>
            <div className="relative">
              <select
                value={matterId}
                onChange={(e) => {
                  const newMatterId = e.target.value;
                  setMatterId(newMatterId);
                  const matter = availableMatters.find((m) => m.id === newMatterId);
                  const firstCourse = matter?.subsections[0]?.courses[0];
                  setCourseId(firstCourse?.id ?? '');
                }}
                className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#111111] p-3 pr-8 text-sm text-slate-200 outline-none transition-colors hover:border-zinc-700 focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                {availableMatters.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#111111] text-slate-200">
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Menu 4: Cours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Cours / Sujet
            </label>
            <div className="relative">
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#111111] p-3 pr-8 text-sm text-slate-200 outline-none transition-colors hover:border-zinc-700 focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111111] text-slate-200">
                    {c.name} ({c.question_count} QCM)
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* ── Boutons d'Action (Sans aucun émoji) ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => handleLaunch('static')}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-3 rounded-xl transition text-sm flex items-center justify-center border border-zinc-700/50"
          >
            QCM Annales
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('dynamic')}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.35)] transition text-sm flex items-center justify-center"
          >
            Lancer Quiz IA
          </button>
        </div>
      </div>
    </div>
  );
}
