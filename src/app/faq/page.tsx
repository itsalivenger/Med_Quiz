'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, ArrowRight, BookOpen, Cpu, ShieldCheck, Mail } from 'lucide-react';

interface FaqEntry {
  category: 'general' | 'concours' | 'ai' | 'security';
  q: string;
  a: string;
  badge?: string;
}

const FAQS: FaqEntry[] = [
  {
    category: 'general',
    q: 'MedQuiz est-il entièrement gratuit pour les étudiants ?',
    a: 'Oui — MedQuiz est 100% gratuit et sans publicité intrusive pour tous les étudiants en médecine (PASS, L.AS, externat DFASM). Vous pouvez commencer immédiatement en mode invité sans carte bancaire ni démarche administrative.',
    badge: 'Accès Libre',
  },
  {
    category: 'general',
    q: 'Dois-je créer un compte pour commencer à m’entraîner ?',
    a: 'Non ! Le mode invité vous donne un accès instantané et complet. Vos statistiques, scores et séries sont conservés localement dans votre navigateur (localStorage). La création d’un compte gratuit vous permet simplement de synchroniser vos données entre votre smartphone, tablette et ordinateur portable.',
    badge: 'Mode Invité',
  },
  {
    category: 'concours',
    q: 'Quelle est la différence entre les modes "QCM Annales" et "Quiz IA" ?',
    a: 'Le mode "QCM Annales" (bordure et pastille sarcelle/teal) s’appuie sur les banques officielles d’annales des concours et examens validées par les collèges enseignants. Le mode "Quiz IA" (bordure et bouton pourpre/crimson) utilise notre modèle d’intelligence médicale pour formuler des cas cliniques inédits à l’infini avec diagnostic différentiel et justification item par item.',
    badge: 'Pédagogie',
  },
  {
    category: 'concours',
    q: 'Les questions couvrent-elles la réforme des EDN / ECOS ?',
    a: 'Oui. Les items cliniques de 4e, 5e et 6e année sont structurés selon la typologie officielle des EDN : questions à choix multiples (QCM), questions à réponses multiples (QRM), dossiers progressifs et raisonnement sémiologique.',
    badge: 'Réforme EDN',
  },
  {
    category: 'ai',
    q: 'Quelle est la fiabilité des cas cliniques générés par l’IA ?',
    a: 'Nos modèles s’appuient sur une architecture RAG (Retrieval-Augmented Generation) indexant les référentiels officiels des collèges médicaux français (CNEA, SFC, CNGOF, Collège de Pédiatrie, etc.). Chaque proposition fausse fait l’objet d’un contre-argument clinique explicite afin d’éliminer les hallucinations.',
    badge: 'RAG Vérifié',
  },
  {
    category: 'ai',
    q: 'Puis-je cibler spécifiquement mes matières les plus faibles ?',
    a: 'Absolument. Dès que votre taux de précision descend sous les 60% sur une matière donnée (ex. Biochimie ou Pharmacologie), le tableau de bord affiche une alerte "À réviser" et le moteur IA vous propose des séries de renforcement dédiées pour combler vos lacunes.',
    badge: 'IA Adaptative',
  },
  {
    category: 'security',
    q: 'Mes données d’étude et statistiques sont-elles protégées ?',
    a: 'Strictement. En mode invité, aucune donnée ne quitte votre machine. Si vous créez un compte étudiant, vos données de révision sont hébergées sur une infrastructure chiffrée conforme au RGPD européen. Aucune donnée n’est cédée à des tiers ou laboratoires.',
    badge: 'RGPD Médical',
  },
  {
    category: 'security',
    q: 'Comment signaler une coquille ou une erreur médicale sur un QCM ?',
    a: 'Chaque question dispose d’un lien direct de signalement, et notre page Contact permet de remonter immédiatement toute ambiguïté à notre collège de relecture médicale. Les corrections sont répercutées en moins de 24 heures.',
    badge: 'Modération',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Toutes les questions', icon: HelpCircle },
  { id: 'general', label: 'Général & Accès', icon: BookOpen },
  { id: 'concours', label: 'Annales & EDN', icon: ShieldCheck },
  { id: 'ai', label: 'Moteur IA & Cas', icon: Cpu },
  { id: 'security', label: 'Données & Sécurité', icon: ShieldCheck },
];

function FaqItem({ q, a, badge }: { q: string; a: string; badge?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#161616] overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-800/40 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {badge && (
            <span className="hidden sm:inline-block rounded-md bg-zinc-800/90 border border-zinc-700/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              {badge}
            </span>
          )}
          <span className="text-sm font-semibold text-white">{q}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-red-500' : ''
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-800/80 bg-[#121212] px-5 py-4">
          <p className="text-sm leading-relaxed text-zinc-300">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
          <HelpCircle className="h-3.5 w-3.5 text-red-500" />
          <span>Foire Aux Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Comment fonctionne MedQuiz ?
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Tout ce que vous devez savoir sur notre plateforme de révision médicale sans distraction.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-xl mx-auto">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une question (ex. IA, gratuit, concours, RGPD)..."
          className="w-full rounded-xl border border-zinc-800 bg-[#161616] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
        />
      </div>

      {/* Filtres par catégories */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={[
                'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer',
                active
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                  : 'bg-[#161616] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700',
              ].join(' ')}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Liste des questions accordéons */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#161616] p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Aucun résultat correspondant</p>
            <p className="text-xs text-zinc-500">Essayez avec d&apos;autres mots-clés ou consultez notre support.</p>
          </div>
        ) : (
          filteredFaqs.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))
        )}
      </div>

      {/* Bannière de contact */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#161616] to-[#1a1a1a] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-teal-400" />
            <span>Vous avez une question spécifique ?</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Notre équipe médicale et technique vous répond sous 24h ouvrées.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white border border-zinc-700/80 transition-colors"
        >
          <span>Nous contacter</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

