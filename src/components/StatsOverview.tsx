'use client';

import { useUserStore } from '@/store/useUserStore';
import { TrendingUp, CheckCircle2, Flame, AlertTriangle, BookOpen, RotateCcw } from 'lucide-react';
import type { QuizAttempt } from '@/lib/types';

// ─── Données mockées par matière ──────────────────────────────────
const SUBJECT_STATS = [
  { name: 'Anatomie',     accuracy: 82, attempts: 48, color: 'bg-red-600' },
  { name: 'Physiologie',  accuracy: 74, attempts: 35, color: 'bg-zinc-600' },
  { name: 'Biochimie',    accuracy: 45, attempts: 22, color: 'bg-red-500', needsReview: true },
  { name: 'Pathologie',   accuracy: 68, attempts: 30, color: 'bg-zinc-500' },
  { name: 'Pharmacologie',accuracy: 55, attempts: 18, color: 'bg-zinc-600' },
];

// ─── Composant Carte Stat ─────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  sub,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#181818] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        <Icon className="h-4 w-4 text-red-500" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-zinc-500">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Barre de précision par matière ───────────────────────────────
function SubjectBar({ name, accuracy, attempts, color, needsReview }: typeof SUBJECT_STATS[0]) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-200">
          {name}
          {needsReview && (
            <span className="flex items-center gap-1 rounded bg-red-950/40 border border-red-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
              À réviser
            </span>
          )}
        </span>
        <span className="font-bold tabular-nums text-white">{accuracy}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
      <p className="text-right text-[10px] text-zinc-500">{attempts} essais</p>
    </div>
  );
}

// ─── Ligne d'historique ───────────────────────────────────────────
function HistoryRow({ attempt, index }: { attempt: QuizAttempt; index: number }) {
  const pct = Math.round((attempt.score / attempt.total) * 100);
  const date = new Date(attempt.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr
      className={`transition-colors hover:bg-zinc-800/40 ${
        index % 2 === 0 ? '' : 'bg-zinc-900/30'
      }`}
    >
      <td className="px-4 py-3 text-xs text-zinc-400">{date}</td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-slate-200">{attempt.course_id}</span>
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            attempt.mode === 'dynamic'
              ? 'bg-red-950/40 text-red-400 border border-red-900/40'
              : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {attempt.mode === 'dynamic' ? 'IA' : 'Annales'}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`text-sm font-bold ${
            pct >= 70 ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {attempt.score}/{attempt.total}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <button className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
          <RotateCcw className="h-3 w-3" /> Recommencer
        </button>
      </td>
    </tr>
  );
}

// ─── Composant Principal StatsOverview ────────────────────────────
export default function StatsOverview() {
  const { history, isGuest, displayName } = useUserStore();

  const totalSolved = history.reduce((s, a) => s + a.total, 0);
  const totalCorrect = history.reduce((s, a) => s + a.score, 0);
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  const weakSpots = SUBJECT_STATS.filter((s) => s.accuracy < 60).length;

  const STATS = [
    { icon: BookOpen,     value: totalSolved,    label: 'Questions traitées', sub: 'Toutes sessions' },
    { icon: CheckCircle2, value: `${accuracy}%`,  label: 'Précision globale', sub: `${totalCorrect} correctes` },
    { icon: Flame,        value: 7,              label: 'Série de révisions', sub: 'Jours consécutifs' },
    { icon: TrendingUp,   value: weakSpots,       label: 'Points à renforcer', sub: 'Score < 60%' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Avertissement Mode Invité */}
      {isGuest && (
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-xs font-semibold text-white">Session Invité</p>
            <p className="text-[11px] text-zinc-400">
              Vos statistiques sont sauvegardées localement dans votre navigateur.
            </p>
          </div>
        </div>
      )}

      {/* Titre et en-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {displayName ? `Tableau de bord de ${displayName}` : 'Aperçu des performances'}
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Suivez votre progression et ciblez vos révisions médicales.
        </p>
      </div>

      {/* Grille de cartes KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      {/* Précision par matière */}
      <div className="rounded-xl border border-zinc-800 bg-[#181818] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Précision par matière</h2>
        <div className="space-y-3">
          {SUBJECT_STATS.map((sub) => (
            <SubjectBar key={sub.name} {...sub} />
          ))}
        </div>
      </div>

      {/* Table des sessions récentes */}
      <div className="rounded-xl border border-zinc-800 bg-[#181818] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Sessions récentes</h2>
        {history.length === 0 ? (
          <p className="text-xs text-zinc-500">Aucune session enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Matière / Sujet</th>
                  <th className="px-4 py-2 text-center">Score</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {history.map((att, i) => (
                  <HistoryRow key={att.id ?? `${att.course_id}-${att.date}-${i}`} attempt={att} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
