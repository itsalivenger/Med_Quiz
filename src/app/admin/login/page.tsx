'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin({ email, password, securityKey });
      if (res && res.token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('medquiz_admin_auth', 'true');
          sessionStorage.setItem('medquiz_admin_token', res.token);
        }
        router.push('/admin');
      } else {
        setError('Réponse administrateur invalide.');
      }
    } catch (err: any) {
      setError(err?.message || 'Accès refusé. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up space-y-6">
        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* En-tête épuré */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-500" />
            <span>Administration</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Espace réservé à la faculté et aux modérateurs.
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 sm:p-8 shadow-xl shadow-black/60">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-medium text-zinc-300">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medquiz.fr"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-xs font-medium text-zinc-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
                />
              </div>
            </div>

            {/* Clé de sécurité */}
            <div className="space-y-1.5">
              <label htmlFor="security-key" className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Clé de sécurité</span>
                <span className="text-[10px] text-zinc-500 font-normal">Optionnelle</span>
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="security-key"
                  type="text"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="MED-FACULTY-2026"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm font-mono text-white placeholder-zinc-600 outline-none transition focus:border-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/40 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}
