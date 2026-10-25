'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function LoginPage() {
  const router = useRouter();
  const { migrateGuestToAccount } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email.includes('@') && password.length >= 6) {
        const name = email.split('@')[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        await migrateGuestToAccount({
          authToken: 'token_' + Date.now(),
          displayName: formattedName,
        });
        router.push('/dashboard');
      } else {
        setError('Identifiants invalides. Le mot de passe doit comporter au moins 6 caractères.');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'etudiant' | 'externe') => {
    if (role === 'etudiant') {
      setEmail('etudiant.pass@medquiz.fr');
      setPassword('medecine2026');
    } else {
      setEmail('externe.edn@medquiz.fr');
      setPassword('externat2026');
    }
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Espace Étudiant Médical
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Connexion à MedQuiz
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Retrouvez votre historique de QCM, vos statistiques et vos révisions ciblées.
          </p>
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

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Adresse email universitaire
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@etudiant-medecine.fr"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => alert('Lien de réinitialisation envoyé à votre adresse.')}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Oublié ?
                </button>
              </div>
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

            {/* Options additionnelles */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Se souvenir de moi</span>
              </label>

              <span className="flex items-center gap-1 text-[11px] text-teal-400">
                <CheckCircle2 className="h-3 w-3" />
                Chiffrement TLS 256
              </span>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Vérification des identifiants…</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Démonstration en 1-clic */}
          <div className="mt-6 border-t border-zinc-800/80 pt-4">
            <p className="text-[11px] font-medium text-zinc-500 mb-2.5 text-center">
              Comptes de démonstration rapide :
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('etudiant')}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                PASS / L.AS (1-2e année)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('externe')}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                Externat / EDN (4-6e année)
              </button>
            </div>
          </div>

          {/* Mode invité & Inscription */}
          <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-zinc-800/80 text-center text-xs">
            <Link
              href="/selection"
              className="text-zinc-400 hover:text-teal-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span>Continuer sans compte en mode invité</span>
            </Link>

            <p className="text-zinc-500">
              Pas encore inscrit ?{' '}
              <Link href="/auth/signup" className="font-semibold text-red-500 hover:text-red-400 underline underline-offset-4">
                Créer un compte étudiant
              </Link>
            </p>
          </div>
        </div>

        {/* Accès enseignant & faculté */}
        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" />
            <span>Portail Enseignant & Administration Faculté</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
