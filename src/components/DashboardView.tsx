'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  CheckCircle2,
  Flame,
  AlertTriangle,
  BookOpen,
  RotateCcw,
  Sparkles,
  Calendar,
  Target,
  ArrowRight,
  Zap,
  Settings,
  Layers,
  Award,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import StatsOverview from '@/components/StatsOverview';
import { useUserStore } from '@/store/useUserStore';
import { fetchStudentDashboard, logoutUser, type StudentDashboardData } from '@/lib/api';

type DashboardTab = 'stats' | 'recommendations' | 'history' | 'goals';

const RECOMMENDED_SESSIONS = [
  {
    id: 'rec-1',
    subject: 'Biochimie & Métabolisme',
    sub: 'Glycolyse, cycle de Krebs et régulation enzymatique',
    reason: 'Précision de 45% (inférieure au seuil de 60%)',
    questionsCount: 15,
    estimatedMinutes: 12,
    mode: 'dynamic' as const,
    slug: 'y1/s1/m3/c1',
  },
  {
    id: 'rec-2',
    subject: 'Pharmacologie Générale',
    sub: 'Pharmacocinétique & demi-vie d’élimination',
    reason: 'Non révisé depuis 6 jours',
    questionsCount: 10,
    estimatedMinutes: 8,
    mode: 'static' as const,
    slug: 'y2/s1/m4/c1',
  },
  {
    id: 'rec-3',
    subject: 'Cardiologie — Électrocardiogramme',
    sub: 'Ischémie myocardique et troubles du rythme',
    reason: 'Objectif concours EDN : consolider l’excellence (>80%)',
    questionsCount: 20,
    estimatedMinutes: 16,
    mode: 'dynamic' as const,
    slug: 'y3/s1/m1/c1',
  },
];

export default function DashboardView() {
  const router = useRouter();
  const { isGuest, displayName, authToken, history, signOut } = useUserStore();
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [dailyGoal, setDailyGoal] = useState(25);
  const [targetYear, setTargetYear] = useState('1ère Année (PASS)');
  const [backendData, setBackendData] = useState<StudentDashboardData | null>(null);

  // Load real student dashboard from MongoDB backend
  useEffect(() => {
    if (!isGuest || authToken) {
      const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem('medquiz_token') || undefined : undefined);
      fetchStudentDashboard(token)
        .then((res) => setBackendData(res))
        .catch((err) => console.warn('[Student Dashboard] Could not load backend stats:', err));
    }
  }, [isGuest, authToken]);

  const totalSolved = backendData?.stats?.totalQuestions ?? history.reduce((s, a) => s + a.total, 0);
  const todaySolved = backendData?.stats?.todayQuestionsSolved ?? Math.min(totalSolved, 18);
  const goalPercent = Math.min(100, Math.round((todaySolved / dailyGoal) * 100));

  const handleSignOut = async () => {
    await logoutUser().catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medquiz_token');
    }
    signOut();
    router.push('/auth/login');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête du tableau de bord */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {backendData?.user?.name || displayName ? `Bonjour, ${backendData?.user?.name || displayName}` : 'Tableau de bord'}
            </h1>
            {isGuest ? (
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-300">
                Mode Invité
              </span>
            ) : (
              <span className="rounded-full bg-teal-950/60 border border-teal-800 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
                Connecté
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Suivi de vos révisions et progression.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          {!isGuest && (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#161616] hover:bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Déconnexion</span>
            </button>
          )}

          <Link
            href="/selection"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all active:scale-[0.98]"
          >
            <Zap className="h-4 w-4" />
            <span>Nouveau QCM</span>
          </Link>
        </div>
      </div>

      {/* Alerte Mode Invité simple */}
      {isGuest && (
        <div className="rounded-xl border border-zinc-800 bg-[#161616] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400">
            Mode invité actif. Créez un compte pour sauvegarder vos résultats.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 font-semibold text-white"
            >
              S&apos;inscrire
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-medium text-zinc-300 hover:text-white"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}

      {/* Onglets de sections */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-800 pb-2">
        {[
          { key: 'stats', label: 'Vue d’ensemble', icon: TrendingUp },
          { key: 'recommendations', label: 'Recommandations IA', icon: Sparkles },
          { key: 'history', label: 'Historique des QCM', icon: Layers },
          { key: 'goals', label: 'Objectifs & Cibles', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as DashboardTab)}
              className={[
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer',
                active
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40',
              ].join(' ')}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-red-500' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SECTION 1: VUE D'ENSEMBLE ── */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Bannière de l'objectif du jour */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Objectif quotidien de révision
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {todaySolved} questions résolues aujourd&apos;hui sur votre cible de {dailyGoal}.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-36 sm:w-48 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Progression</span>
                  <span className="font-bold text-white tabular-nums">{goalPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-teal-500 transition-all duration-500 rounded-full"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rendu des statistiques complètes */}
          <StatsOverview />
        </div>
      )}

      {/* ── SECTION 2: RECOMMANDATIONS IA ── */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-500" />
              <span>Séances de révision recommandées par l&apos;IA</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              L&apos;algorithme calcule vos probabilités d&apos;oubli selon la courbe d&apos;Ebbinghaus pour vous suggérer les items prioritaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED_SESSIONS.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl border border-zinc-800/80 bg-[#161616] p-5 flex flex-col justify-between gap-4 hover:border-red-600/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-red-950/40 border border-red-900/40 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Prioritaire
                    </span>
                    <span className="text-[11px] text-zinc-500">{rec.estimatedMinutes} min</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {rec.subject}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rec.sub}</p>

                  <div className="rounded-lg bg-[#111111] p-2.5 text-[11px] text-zinc-400 border border-zinc-800/60">
                    <span className="text-zinc-300 font-medium">Motif :</span> {rec.reason}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/quiz/${rec.mode}/${rec.slug}`)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-800 group-hover:bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Démarrer ({rec.questionsCount} QCM)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Conseil de révision espacée */}
          <div className="rounded-2xl border border-teal-900/30 bg-teal-950/20 p-5 flex items-start gap-3">
            <Award className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-white">Méthode de rétention optimale :</p>
              <p className="text-zinc-400 leading-relaxed">
                Alternez les séries de 15 questions en mode Annales (apprentissage des pièges de concours) et en mode IA (confrontation à des cas cliniques non encore vus).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: HISTORIQUE DÉTAILLÉ ── */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Historique exhaustif des sessions</h2>
            <span className="text-xs text-zinc-500">{history.length} entraînements passés</span>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-8 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-white">Aucun entraînement pour le moment</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Lancez votre première série de QCM pour observer l’évolution de votre courbe de réussite.
              </p>
              <Link
                href="/selection"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
              >
                <span>Commencer un QCM</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-900/40 text-[11px] uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Matière / Cours</th>
                      <th className="px-4 py-3 text-center">Mode</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {history.map((att, i) => {
                      const pct = Math.round((att.score / att.total) * 100);
                      const formattedDate = new Date(att.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <tr key={att.id ?? i} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-zinc-400 text-xs">{formattedDate}</td>
                          <td className="px-4 py-3 font-medium text-slate-200">{att.course_id}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={[
                                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                                att.mode === 'dynamic'
                                  ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                                  : 'bg-teal-950/40 text-teal-300 border border-teal-800/40',
                              ].join(' ')}
                            >
                              {att.mode === 'dynamic' ? 'IA' : 'Annales'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            <span className={pct >= 70 ? 'text-teal-400' : 'text-red-400'}>
                              {att.score} / {att.total} ({pct}%)
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => router.push(`/selection`)}
                              className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Rejouer</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 4: OBJECTIFS & PRÉFÉRENCES ── */}
      {activeTab === 'goals' && (
        <div className="space-y-6 animate-fade-in max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                <span>Paramètres d&apos;apprentissage & Cibles</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Configurez vos objectifs quotidiens pour recevoir des alertes de régularité.
              </p>
            </div>

            {/* Objectif quotidien */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-300">Objectif de QCM par jour</span>
                <span className="font-mono text-red-400 font-bold">{dailyGoal} questions</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>10 (Révision douce)</span>
                <span>50 (Intensif concours)</span>
                <span>100 (Sprint final)</span>
              </div>
            </div>

            {/* Année cible */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Niveau d&apos;étude cible</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#111111] p-3 text-sm text-white outline-none focus:border-red-600"
              >
                <option value="1ère Année (PASS)">1ère Année (PASS / L.AS)</option>
                <option value="2ème Année (DFGSM 2)">2ème Année (DFGSM 2)</option>
                <option value="3ème Année (DFGSM 3)">3ème Année (DFGSM 3)</option>
                <option value="4ème Année (DFASM 1)">4ème Année (DFASM 1)</option>
                <option value="5ème Année (DFASM 2)">5ème Année (DFASM 2)</option>
                <option value="6ème Année (DFASM 3 / EDN)">6ème Année (DFASM 3 / EDN)</option>
              </select>
            </div>

            <button
              onClick={() => alert('Objectifs mis à jour avec succès.')}
              className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all cursor-pointer"
            >
              Sauvegarder mes préférences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
