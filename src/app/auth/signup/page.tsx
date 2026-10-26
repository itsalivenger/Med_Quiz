'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { signupStudent } from '@/lib/api';

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      const res = await signupStudent({
        name: name.trim() || email.split('@')[0],
        email,
        password,
        year,
      });

      if (res && res.token) {
        await migrateGuestToAccount({
          authToken: res.token,
          displayName: res.user.name,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('medquiz_token', res.token);
        }

        router.push('/dashboard');
      } else {
        setError('Une erreur est survenue lors de l’inscription.');
      }
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up space-y-6">
        {/* En-tête épuré */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Créer un compte
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Sauvegardez votre progression et vos scores.
          </p>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 sm:p-8 shadow-xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Nom */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-zinc-300">
                Nom ou Pseudo
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-300">
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
                  placeholder="nom@universite.fr"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
                />
              </div>
            </div>

            {/* Année d'étude */}
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                <span>Niveau d&apos;étude</span>
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 px-3 text-sm text-white outline-none transition focus:border-red-600"
              >
                {STUDY_YEARS.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-zinc-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
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

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Création en cours…</span>
              ) : (
                <>
                  <span>S&apos;inscrire</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-5 border-t border-zinc-800/80 pt-4 text-center text-xs text-zinc-400">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="font-semibold text-red-500 hover:text-red-400">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
