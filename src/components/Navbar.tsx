// RSC — no 'use client'
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/80 backdrop-blur-md border-b border-zinc-800/60 px-6 py-3.5">
      <div className="mx-auto flex max-w-5xl items-center justify-between">

        {/* ── Left: Logo + Dual Pulse Dots (crimson + teal) ── */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex items-center gap-1" aria-hidden="true">
            {/* Crimson pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            {/* Teal pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-60 animate-ping [animation-delay:0.4s]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
          </span>
          <span className="text-base font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
            MedQuiz
          </span>
        </Link>

        {/* ── Center: Navigation minimale ── */}
        <nav className="flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Catalogue
          </Link>
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Tableau de bord
          </Link>
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            FAQ
          </Link>
        </nav>

        {/* ── Right: Guest pill (teal indicator) + Sign In ── */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            Mode Invité
          </span>
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Connexion
          </Link>
        </div>

      </div>
    </header>
  );
}
