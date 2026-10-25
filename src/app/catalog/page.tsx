'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
  X,
  Layers,
  BookOpen,
  FolderTree,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_HIERARCHY } from '@/components/QuickLauncher';
import type { Course } from '@/lib/types';

// ─── Modal: Launch Config Drawer ──────────────────────────────────
interface LaunchModalProps {
  course: Course & { slug: string[]; path: string };
  onClose: () => void;
}

function LaunchModal({ course, onClose }: LaunchModalProps) {
  const router = useRouter();
  const slugPath = course.slug.join('/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#181818] p-6 shadow-2xl animate-fade-up text-left">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">
          Topic Selected
        </span>

        <h3 className="mt-1 text-lg font-bold text-white">{course.name}</h3>
        <p className="mt-0.5 text-xs text-zinc-400">{course.path}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => router.push(`/quiz/static/${slugPath}`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 text-sm transition-colors border border-zinc-700/50"
          >
            <span>Static Board Quiz</span>
          </button>

          <button
            onClick={() => router.push(`/quiz/dynamic/${slugPath}`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3 text-sm transition-colors shadow-lg shadow-red-900/30"
          >
            <span>Start AI Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Progress Ring Component ──────────────────────────────────────
function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, completed / (total || 1)));
  const offset = circumference - pct * circumference;

  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <svg className="h-8 w-8 -rotate-90 transform" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          className="stroke-zinc-800"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="16"
          cy="16"
          r={radius}
          className="stroke-red-600 transition-all duration-300"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute text-[8px] font-bold text-zinc-300">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

// ─── System Group Accordion ───────────────────────────────────────
interface SystemGroupProps {
  name: string;
  courses: Course[];
  yearId: string;
  semId: string;
  matterId: string;
  query: string;
  onSelect: (c: Course & { slug: string[]; path: string }) => void;
  fullPathPrefix: string;
}

function SystemGroupAccordion({
  name,
  courses,
  yearId,
  semId,
  matterId,
  query,
  onSelect,
  fullPathPrefix,
}: SystemGroupProps) {
  const [open, setOpen] = useState(true);

  const filtered = query
    ? courses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : courses;

  if (query && filtered.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#181818] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-800/40"
      >
        <div className="flex items-center gap-2.5">
          <FolderTree className="h-4 w-4 text-red-500" />
          <h4 className="text-sm font-semibold text-slate-200">{name}</h4>
          <span className="text-[11px] text-zinc-500">({filtered.length} topics)</span>
        </div>

        {open ? (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        )}
      </button>

      {open && (
        <div className="border-t border-zinc-800/80 p-3 bg-[#141414]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filtered.map((course, idx) => {
              const completedCount = Math.min(course.question_count, 8 + (idx % 5));
              const match = query && course.name.toLowerCase().includes(query.toLowerCase());

              return (
                <div
                  key={course.id}
                  onClick={() =>
                    onSelect({
                      ...course,
                      slug: [yearId, semId, matterId, course.id],
                      path: `${fullPathPrefix} > ${name} > ${course.name}`,
                    })
                  }
                  className={[
                    'group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors',
                    'bg-[#181818] hover:border-red-600/50 hover:bg-[#1e1e1e]',
                    match ? 'border-red-600 bg-red-950/20' : 'border-zinc-800',
                  ].join(' ')}
                >
                  <div className="flex-1 pr-2 truncate">
                    <span className="block truncate text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
                      {course.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {completedCount}/{course.question_count} completed
                    </span>
                  </div>

                  <ProgressRing completed={completedCount} total={course.question_count} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Catalog Page ────────────────────────────────────────────
export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const [activeYear, setActiveYear] = useState(MOCK_HIERARCHY[0]?.id ?? 'y1');
  const [selectedCourseModal, setSelectedCourseModal] = useState<
    (Course & { slug: string[]; path: string }) | null
  >(null);

  const currentYear = MOCK_HIERARCHY.find((y) => y.id === activeYear) ?? MOCK_HIERARCHY[0];

  const allFlattenedCourses = useMemo(() => {
    return MOCK_HIERARCHY.flatMap((y) =>
      y.semesters.flatMap((s) =>
        s.matters.flatMap((m) =>
          m.subsections.flatMap((ss) =>
            ss.courses.map((c) => ({
              ...c,
              slug: [y.id, s.id, m.id, c.id],
              path: `${y.name} > ${s.name} > ${m.name} > ${ss.name}`,
              matterName: m.name,
            }))
          )
        )
      )
    );
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return allFlattenedCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.path.toLowerCase().includes(q) ||
        c.matterName.toLowerCase().includes(q)
    );
  }, [query, allFlattenedCourses]);

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Course Catalog</h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
              Select any topic to start a targeted static or dynamic quiz.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 self-start sm:self-auto border border-zinc-800 rounded-full px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {allFlattenedCourses.length} Topics Available
          </span>
        </div>

        {/* ── Search & Year Filter Strip ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics (e.g., Scapula, Brainstem, ECG)..."
              className="w-full rounded-xl border border-zinc-800 bg-[#181818] py-2.5 pl-10 pr-9 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181818] border border-zinc-800">
            {MOCK_HIERARCHY.map((y) => (
              <button
                key={y.id}
                onClick={() => setActiveYear(y.id)}
                className={[
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  activeYear === y.id
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-400 hover:text-slate-200',
                ].join(' ')}
              >
                {y.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-[#181818] p-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
              Matching Topics ({searchResults.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourseModal(c)}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-zinc-800 bg-[#141414] p-3 hover:border-red-600/50 transition-colors"
                >
                  <div className="truncate pr-2">
                    <p className="text-sm font-medium text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{c.path}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">
                    {c.question_count} Qs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Hierarchy Matrix ── */}
        <div className="space-y-8 pt-2">
          {currentYear.semesters.map((sem) => (
            <div key={sem.id} className="space-y-4">
              <h3 className="text-base font-bold text-slate-300 border-l-2 border-red-600 pl-2.5">
                {sem.name}
              </h3>

              <div className="space-y-4">
                {sem.matters.map((matter) => (
                  <div key={matter.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{matter.name}</span>
                    </div>

                    <div className="space-y-2">
                      {matter.subsections.map((subsec) => (
                        <SystemGroupAccordion
                          key={subsec.id}
                          name={subsec.name}
                          courses={subsec.courses}
                          yearId={currentYear.id}
                          semId={sem.id}
                          matterId={matter.id}
                          query={query}
                          fullPathPrefix={`${currentYear.name} > ${sem.name} > ${matter.name}`}
                          onSelect={setSelectedCourseModal}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourseModal && (
        <LaunchModal
          course={selectedCourseModal}
          onClose={() => setSelectedCourseModal(null)}
        />
      )}
    </div>
  );
}
