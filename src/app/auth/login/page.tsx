'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { loginStudent } from '@/lib/api';

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
      const res = await loginStudent(email, password);
      if (res && res.token) {
        await migrateGuestToAccount({
          authToken: res.token,
          displayName: res.user.name || email.split('@')[0],
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('medquiz_token', res.token);
        }
        router.push('/dashboard');
      } else {
        setError('Réponse de connexion invalide.');
      }
    } catch (err: any) {
      setError(err?.message || 'Identifiants invalides. Veuillez réessayer.');
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
            Connexion
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Accédez à vos séries de QCM et statistiques.
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

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-300">
                Email
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

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-zinc-300">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => alert('Instructions envoyées à votre adresse email.')}
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

            {/* Se souvenir de moi */}
            <div className="flex items-center text-xs pt-0.5">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0"
                />
                <span>Se souvenir de moi</span>
              </label>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Connexion…</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Lien vers inscription */}
          <div className="mt-5 border-t border-zinc-800/80 pt-4 text-center text-xs text-zinc-400">
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" className="font-semibold text-red-500 hover:text-red-400">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
