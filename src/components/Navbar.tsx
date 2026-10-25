// RSC — no 'use client'
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/80 backdrop-blur-md border-b border-zinc-800/50 px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* ── Left: Logo + Crimson Pulse Dot ── */}
        <Link href="/" className="flex items-center group">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          <span className="text-base font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
            MedQuiz
          </span>
        </Link>

        {/* ── Center: Minimal Navigation ── */}
        <nav className="flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Catalogue
          </Link>
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            FAQ
          </Link>
        </nav>

        {/* ── Right: Guest Mode + Sign In ── */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center text-xs text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/40">
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
