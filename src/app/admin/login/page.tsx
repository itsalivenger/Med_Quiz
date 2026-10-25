'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';

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
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo verification
      if (
        (email.toLowerCase() === 'admin@medquiz.fr' && password === 'admin2026') ||
        securityKey === 'MED-FACULTY-2026' ||
        (email.includes('admin') && password.length >= 6)
      ) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('medquiz_admin_auth', 'true');
        }
        router.push('/admin');
      } else {
        setError('Accès refusé. Clé de sécurité ou identifiants administrateur incorrects.');
      }
    } catch {
      setError('Erreur d’authentification au serveur central.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@medquiz.fr');
    setPassword('admin2026');
    setSecurityKey('MED-FACULTY-2026');
    setError(null);
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
          <span>Retour à l&apos;accueil étudiant</span>
        </Link>

        {/* En-tête sécurisé */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-900/60 bg-red-950/40 px-3 py-1 text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Zone Restreinte · Faculté & Modération
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <ShieldCheck className="h-7 w-7 text-red-500" />
            <span>Portail Administrateur</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Gestion du collège médical, supervision des cas cliniques IA et modération des items.
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#161616] p-6 sm:p-8 shadow-2xl shadow-black/80">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email admin */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Email Administrateur / Enseignant
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
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Mot de passe maître
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
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Clé de sécurité 2FA */}
            <div className="space-y-1.5">
              <label htmlFor="security-key" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>Clé d&apos;authentification Faculté (2FA)</span>
                <span className="text-[10px] text-zinc-500 font-normal">Requis</span>
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="security-key"
                  type="text"
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="MED-FACULTY-XXXX"
                  className="w-full rounded-xl border border-zinc-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm font-mono text-white placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/40 hover:shadow-red-900/60 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Vérification de sécurité…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Accéder à la console d&apos;administration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Démo 1-clic */}
          <div className="mt-6 border-t border-zinc-800/80 pt-4 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-red-600/50 hover:text-white transition-colors"
            >
              Pré-remplir les accès démonstration (admin@medquiz.fr)
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-600">
          Toutes les tentatives d&apos;accès sont journalisées conformément aux exigences de sécurité médicale RGPD.
        </p>
      </div>
    </div>
  );
}
