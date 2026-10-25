'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

const STUDY_YEARS = [
  { id: 'y1', label: '1ère Année (PASS / L.AS)' },
  { id: 'y2', label: '2ème Année (DFGSM 2)' },
  { id: 'y3', label: '3ème Année (DFGSM 3)' },
  { id: 'y4', label: '4ème Année (DFASM 1)' },
  { id: 'y5', label: '5ème Année (DFASM 2)' },
  { id: 'y6', label: '6ème Année (DFASM 3 / EDN)' },
];

export default function SignupPage() {
  const router = useRouter();
  const { migrateGuestToAccount } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('y1');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d’utilisation.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      await migrateGuestToAccount({
        authToken: 'token_' + Date.now(),
        displayName: name.trim() || email.split('@')[0],
      });

      router.push('/dashboard');
    } catch {
      setError('Une erreur est survenue lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-up space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Inscription Gratuite
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Rejoignez MedQuiz
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Créez votre profil pour sauvegarder votre progression sur tous vos appareils.
          </p>
        </div>

        {/* Avantages clés */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-[#161616] p-3 text-zinc-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Historique illimité</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-[#161616] p-3 text-zinc-300">
            <Zap className="h-4 w-4 text-red-500 shrink-0" />
            <span>Cas cliniques IA</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-[#161616] p-3 text-zinc-300">
            <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Synchro mobile & PC</span>
          </div>
        </div>

        {/* Carte de formulaire */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#161616] p-6 sm:p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400 flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nom & Prénom */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Nom complet ou Pseudo
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Lemaire"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.lemaire@u-paris.fr"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Année d'étude & Faculté */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="year" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Année d&apos;étude</span>
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 px-3 text-sm text-white outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                >
                  {STUDY_YEARS.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="faculty" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                  <span>UFR / Faculté (Optionnel)</span>
                </label>
                <input
                  id="faculty"
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="Ex. Paris Cité, Lyon Est..."
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 px-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Mot de passe (minimum 6 caractères)
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Accord conditions */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>
                  J&apos;accepte les{' '}
                  <Link href="/legal" className="text-zinc-300 underline underline-offset-2 hover:text-white">
                    Conditions Générales d&apos;Utilisation
                  </Link>{' '}
                  et la politique de confidentialité médicale.
                </span>
              </label>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Création de votre profil…</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte étudiant</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Déjà un compte */}
          <div className="mt-6 border-t border-zinc-800/80 pt-4 text-center text-xs text-zinc-500">
            Vous possédez déjà un compte ?{' '}
            <Link href="/auth/login" className="font-semibold text-red-500 hover:text-red-400 underline underline-offset-4">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
