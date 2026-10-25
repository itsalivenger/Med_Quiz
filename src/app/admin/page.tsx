'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  BookOpen,
  Database,
  Users,
  Cpu,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Download,
  Settings,
  LogOut,
  RefreshCw,
  X,
  FileText,
  Sliders,
} from 'lucide-react';

interface MockQuestion {
  id: string;
  itemCode: string;
  year: string;
  matter: string;
  vignette: string;
  status: 'valid' | 'review';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  author: string;
}

const INITIAL_QUESTIONS: MockQuestion[] = [
  {
    id: 'q-101',
    itemCode: 'ITEM-15-A',
    year: '1ère Année',
    matter: 'Anatomie',
    vignette: 'Rapports anatomiques du nerf axillaire dans l’espace axillaire latéral (quadrilatère de Velpeau).',
    status: 'valid',
    difficulty: 'Moyen',
    author: 'Pr. D. Mercier (Collège Anatomie)',
  },
  {
    id: 'q-102',
    itemCode: 'ITEM-224',
    year: '3ème Année',
    matter: 'Cardiologie',
    vignette: 'Diagnostic différentiel d’une élévation du segment ST chez un patient de 24 ans sans facteur de risque.',
    status: 'valid',
    difficulty: 'Difficile',
    author: 'Dr. E. Benali (SFC)',
  },
  {
    id: 'q-103',
    itemCode: 'ITEM-88',
    year: '2ème Année',
    matter: 'Pharmacologie',
    vignette: 'Mécanisme d’action et effets indésirables des inhibiteurs de l’enzyme de conversion (IEC).',
    status: 'review',
    difficulty: 'Moyen',
    author: 'Modérateur IA (Revue requise)',
  },
  {
    id: 'q-104',
    itemCode: 'ITEM-312',
    year: '4ème Année',
    matter: 'Pédiatrie',
    vignette: 'Prise en charge d’une bronchiolite aiguë du nourrisson de moins de 3 mois fébrile.',
    status: 'valid',
    difficulty: 'Facile',
    author: 'Collège de Pédiatrie',
  },
  {
    id: 'q-105',
    itemCode: 'ITEM-142',
    year: '1ère Année',
    matter: 'Biochimie',
    vignette: 'Régulation allostérique de la phosphofructokinase-1 (PFK-1) lors de la glycolyse hépatique.',
    status: 'valid',
    difficulty: 'Difficile',
    author: 'Comité PACES',
  },
];

interface SupportTicket {
  id: string;
  date: string;
  student: string;
  subject: string;
  item: string;
  status: 'open' | 'resolved';
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-401',
    date: '24 Oct 2026',
    student: 'alexandre.m@u-paris.fr',
    subject: 'Contestation proposition D (Artère circonflexe)',
    item: 'ITEM-15-A',
    status: 'open',
  },
  {
    id: 'TCK-402',
    date: '23 Oct 2026',
    student: 'lea.b@univ-lyon1.fr',
    subject: 'Signalement coquille dans l’explication de la PFK-1',
    item: 'ITEM-142',
    status: 'resolved',
  },
  {
    id: 'TCK-403',
    date: '21 Oct 2026',
    student: 'mehdi.k@amu.fr',
    subject: 'Mise à jour des recommandations ESC 2024 pour l’ECG',
    item: 'ITEM-224',
    status: 'open',
  },
];

type TabKey = 'overview' | 'questions' | 'ai-engine' | 'tickets' | 'settings';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // State Questions
  const [questions, setQuestions] = useState<MockQuestion[]>(INITIAL_QUESTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMatter, setFilterMatter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newVignette, setNewVignette] = useState('');
  const [newMatter, setNewMatter] = useState('Anatomie');
  const [newYear, setNewYear] = useState('1ère Année');
  const [newDifficulty, setNewDifficulty] = useState<'Facile' | 'Moyen' | 'Difficile'>('Moyen');
  const [newItemCode, setNewItemCode] = useState('');

  // State Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // AI settings
  const [aiTemperature, setAiTemperature] = useState(0.2);
  const [aiModel, setAiModel] = useState('gemini-1.5-pro-med-tuned');
  const [cacheEnabled, setCacheEnabled] = useState(true);

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('medquiz_admin_auth');
    }
    router.push('/admin/login');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVignette.trim()) return;

    const newQ: MockQuestion = {
      id: 'q-' + Date.now(),
      itemCode: newItemCode || 'ITEM-' + Math.floor(Math.random() * 300),
      year: newYear,
      matter: newMatter,
      vignette: newVignette,
      status: 'valid',
      difficulty: newDifficulty,
      author: 'Administration (Manuel)',
    };

    setQuestions([newQ, ...questions]);
    setShowAddModal(false);
    setNewVignette('');
    setNewItemCode('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleToggleTicket = (id: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, status: t.status === 'open' ? 'resolved' : 'open' } : t
      )
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchQuery =
      q.vignette.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.matter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMatter = filterMatter === 'all' || q.matter === filterMatter;
    return matchQuery && matchMatter;
  });

  return (
    <div className="min-h-screen bg-[#111111] text-slate-100">
      {/* Barre supérieure administration */}
      <div className="sticky top-14 z-40 border-b border-zinc-800/80 bg-[#161616]/95 backdrop-blur px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20 text-red-500 border border-red-900/40">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Console Faculté & Modération</span>
              <span className="rounded bg-red-950/50 border border-red-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">Connecté en tant que modérateur en chef</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Voir le site étudiant</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation des sections par onglets */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-800 pb-2">
          {[
            { key: 'overview', label: 'Vue Globale', icon: Database },
            { key: 'questions', label: 'Banque de QCM', icon: BookOpen },
            { key: 'ai-engine', label: 'Moteur & Cas IA', icon: Cpu },
            { key: 'tickets', label: 'Signalements & Tickets', icon: AlertTriangle },
            { key: 'settings', label: 'Configuration & Serveur', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={[
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer',
                  active
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-slate-200',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── SECTION 1: VUE GLOBALE ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Grille KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 sm:p-5 space-y-2">
                <span className="text-xs font-medium text-zinc-400">Total QCM Validés</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4 820</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-400">
                  <CheckCircle2 className="h-3 w-3" />
                  100% calibrés référentiels
                </span>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 sm:p-5 space-y-2">
                <span className="text-xs font-medium text-zinc-400">Étudiants Actifs (24h)</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">1 248</p>
                <span className="text-[11px] text-zinc-500">+14% vs semaine passée</span>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 sm:p-5 space-y-2">
                <span className="text-xs font-medium text-zinc-400">Taux de Réussite Global</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">68.4%</p>
                <span className="text-[11px] text-emerald-400">Niveau conforme concours</span>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 sm:p-5 space-y-2">
                <span className="text-xs font-medium text-zinc-400">Générations IA (7j)</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">18 430</p>
                <span className="text-[11px] text-teal-400">0.02s latence moyenne</span>
              </div>
            </div>

            {/* Deux colonnes d'aperçu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Activité récente */}
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>Journal d&apos;activité académique</span>
                  </h3>
                  <span className="text-[11px] text-zinc-500">Temps réel</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start justify-between border-b border-zinc-800/60 pb-2.5">
                    <div>
                      <p className="font-semibold text-white">Nouvelle banque EDN 2026 synchronisée</p>
                      <p className="text-zinc-500">Cardiologie · 120 questions injectées</p>
                    </div>
                    <span className="text-[10px] text-zinc-500">Il y a 12 min</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-zinc-800/60 pb-2.5">
                    <div>
                      <p className="font-semibold text-white">Revue de signalement terminée</p>
                      <p className="text-zinc-500">ITEM-142 Biochimie corrigé par modération</p>
                    </div>
                    <span className="text-[10px] text-zinc-500">Il y a 45 min</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-zinc-800/60 pb-2.5">
                    <div>
                      <p className="font-semibold text-white">Cache de prompts régénéré</p>
                      <p className="text-zinc-500">Vérification de source automatique activée</p>
                    </div>
                    <span className="text-[10px] text-zinc-500">Il y a 2h</span>
                  </div>
                </div>
              </div>

              {/* État du cluster médical */}
              <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-teal-400" />
                    <span>Statut de l&apos;infrastructure</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                    Opérationnel
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Précision clinique des sources (RAG)</span>
                      <span className="text-white font-mono">99.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '99.8%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Taux de requêtes en cache</span>
                      <span className="text-white font-mono">87.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: '87.4%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Charge CPU du micro-service d&apos;évaluation</span>
                      <span className="text-white font-mono">18%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-400 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 2: GESTION DES QCM & QUESTIONS ── */}
        {activeTab === 'questions' && (
          <div className="space-y-4 animate-fade-in">
            {/* Barre de contrôle */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer par code item, mot-clé ou matière…"
                    className="w-full rounded-xl border border-zinc-800 bg-[#161616] py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                  />
                </div>
                <select
                  value={filterMatter}
                  onChange={(e) => setFilterMatter(e.target.value)}
                  className="rounded-xl border border-zinc-800 bg-[#161616] py-2 px-3 text-xs sm:text-sm text-white outline-none"
                >
                  <option value="all">Toutes matières</option>
                  <option value="Anatomie">Anatomie</option>
                  <option value="Biochimie">Biochimie</option>
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Pharmacologie">Pharmacologie</option>
                  <option value="Pédiatrie">Pédiatrie</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Créer un QCM</span>
              </button>
            </div>

            {/* Table des items */}
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-900/40 text-[11px] uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Code Item</th>
                      <th className="px-4 py-3">Niveau & Matière</th>
                      <th className="px-4 py-3">Énoncé Vignette</th>
                      <th className="px-4 py-3 text-center">Difficulté</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                          {q.itemCode}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-medium text-slate-200">{q.matter}</span>
                          <span className="block text-[10px] text-zinc-500">{q.year}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300 max-w-md truncate">
                          {q.vignette}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={[
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              q.difficulty === 'Difficile'
                                ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                                : q.difficulty === 'Moyen'
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40',
                            ].join(' ')}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={[
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                              q.status === 'valid'
                                ? 'bg-teal-950/40 text-teal-300 border border-teal-800/40'
                                : 'bg-zinc-800 text-zinc-400',
                            ].join(' ')}
                          >
                            {q.status === 'valid' ? 'Validé Collège' : 'En révision'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => alert(`Édition de ${q.itemCode}`)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 3: MOTEUR IA & CAS CLINIQUES ── */}
        {activeTab === 'ai-engine' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-red-500" />
                  <span>Paramètres du Générateur de Cas Cliniques IA</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ajustez la créativité, la rigueur clinique et la validation des sources des vignettes générées.
                </p>
              </div>

              {/* Modèle IA */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Modèle de Fondations Médicales</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] p-3 text-sm text-white outline-none focus:border-red-600"
                >
                  <option value="gemini-1.5-pro-med-tuned">Google Gemini 1.5 Pro (Fine-tuné Référentiels Médicaux)</option>
                  <option value="gemini-1.5-flash-fast">Google Gemini 1.5 Flash (Ultra-rapide, basse latence)</option>
                  <option value="med-claude-3-haiku">Claude 3.5 Sonnet (Spécialiste Diagnostic Différentiel)</option>
                </select>
              </div>

              {/* Température */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-300">Température de génération (Stricte vs Inventive)</span>
                  <span className="font-mono text-red-400">{aiTemperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>0.0 (Strictement conforme aux annales)</span>
                  <span>1.0 (Variations cliniques rares)</span>
                </div>
              </div>

              {/* Cache toggle */}
              <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#111111] p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Cache sémantique des questions</p>
                  <p className="text-xs text-zinc-500">Réutilise les questions similaires validées pour réduire les coûts et latences.</p>
                </div>
                <button
                  onClick={() => setCacheEnabled(!cacheEnabled)}
                  className={[
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    cacheEnabled ? 'bg-teal-500' : 'bg-zinc-700',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      cacheEnabled ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>

              {/* Source RAG */}
              <div className="rounded-xl border border-zinc-800/80 bg-[#111111] p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Référentiels Médicaux Actifs dans le RAG
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-900 border-zinc-700 text-teal-500" />
                    <span>Collège National des Enseignants d&apos;Anatomie</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-900 border-zinc-700 text-teal-500" />
                    <span>Société Française de Cardiologie (SFC 2024)</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-900 border-zinc-700 text-teal-500" />
                    <span>Collège Français des Enseignants en Pédiatrie</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-900 border-zinc-700 text-teal-500" />
                    <span>Annales Officielles EDN 2020-2025</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => alert('Configuration IA enregistrée avec succès.')}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all cursor-pointer"
              >
                Enregistrer les paramètres du moteur
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION 4: TICKETS & SIGNALEMENTS ── */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Signalements et Réclamations Étudiants</h3>
                <p className="text-xs text-zinc-400">Vérifiez les erreurs signalées sur les QCM et apportez les correctifs.</p>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                {tickets.filter((t) => t.status === 'open').length} tickets ouverts
              </span>
            </div>

            <div className="space-y-2.5">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-zinc-800 bg-[#161616] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-500">{t.id}</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                        {t.item}
                      </span>
                      <span className="text-[11px] text-zinc-500">{t.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{t.subject}</p>
                    <p className="text-xs text-zinc-400">Étudiant : {t.student}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                        t.status === 'resolved'
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40'
                          : 'bg-amber-950/40 text-amber-300 border border-amber-900/40',
                      ].join(' ')}
                    >
                      {t.status === 'resolved' ? 'Résolu' : 'En attente'}
                    </span>

                    <button
                      onClick={() => handleToggleTicket(t.id)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {t.status === 'resolved' ? 'Rouvrir' : 'Marquer Traité'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 5: PARAMÈTRES & CONFIGURATION ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="h-4 w-4 text-zinc-400" />
                <span>Configuration Système & Maintenance</span>
              </h3>

              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">Mode Maintenance</p>
                  <p className="text-xs text-zinc-500">
                    Affiche une page de mise à jour aux étudiants pendant l&apos;actualisation des banques.
                  </p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={[
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    maintenanceMode ? 'bg-red-600' : 'bg-zinc-700',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      maintenanceMode ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>

              {/* Export Data */}
              <div className="space-y-2 border-b border-zinc-800/80 pb-4">
                <p className="text-sm font-semibold text-white">Exportation de la Base de Données</p>
                <p className="text-xs text-zinc-500">
                  Téléchargez une archive chiffrée de toutes les questions et statistiques au format standardisé.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => alert('Génération du fichier CSV en cours…')}
                    className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    onClick={() => alert('Génération du dump JSON en cours…')}
                    className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Exporter JSON</span>
                  </button>
                </div>
              </div>

              {/* Purge Cache */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Purge Complète du Cache</p>
                <p className="text-xs text-zinc-500">
                  Supprime les entrées temporaires et force le recalcul des statistiques d&apos;évaluation.
                </p>
                <button
                  onClick={() => alert('Cache système purgé avec succès.')}
                  className="flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Vider les caches Edge</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALE D'AJOUT D'UN QCM ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#181818] p-6 shadow-2xl animate-fade-up text-left space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-red-500" />
                <span>Nouveau QCM / Item Médical</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Code Item</label>
                  <input
                    type="text"
                    required
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    placeholder="Ex. ITEM-15"
                    className="w-full rounded-xl border border-zinc-800 bg-[#111111] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Difficulté</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-800 bg-[#111111] px-3 py-2 text-xs text-white"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Matière</label>
                  <input
                    type="text"
                    required
                    value={newMatter}
                    onChange={(e) => setNewMatter(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-[#111111] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Année</label>
                  <input
                    type="text"
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-[#111111] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-zinc-400">Énoncé du cas clinique</label>
                <textarea
                  rows={4}
                  required
                  value={newVignette}
                  onChange={(e) => setNewVignette(e.target.value)}
                  placeholder="Un patient de 45 ans se présente pour dyspnée aiguë…"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-900/30"
                >
                  Créer et publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
