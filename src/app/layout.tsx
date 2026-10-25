import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SpotlightGrid from '@/components/SpotlightGrid';
import AmbientGlow from '@/components/AmbientGlow';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'MedQuiz — Réussissez vos examens de médecine sans distraction', template: '%s | MedQuiz' },
  description:
    'Annales de concours, cas cliniques et entraînement IA instantané pour étudiants en médecine. Zéro friction, performance maximale.',
  keywords: ['qcm médecine', 'edn', 'paces', 'pass', 'las', 'anatomie', 'pharmacologie', 'cas cliniques', 'quiz médecine'],
  openGraph: {
    title: 'MedQuiz — Réussissez vos examens de médecine sans distraction',
    description: 'Annales de concours, cas cliniques et entraînement IA instantané pour étudiants en médecine.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
};

const CURRENT_YEAR = 2026;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-[#111111] text-slate-100">
        <SpotlightGrid />
        <AmbientGlow />
        <Navbar />
        <main className="relative z-10 flex flex-1 flex-col pt-14">{children}</main>
        <footer className="relative z-10 border-t border-zinc-800/60 py-8 px-4 text-center text-xs text-zinc-500">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-zinc-400">MedQuiz · Plateforme Médicale Zéro Distraction</p>
              <p className="mt-0.5 text-[11px] text-zinc-600">
                © {CURRENT_YEAR} MedQuiz · Conforme aux référentiels des collèges nationaux d&apos;enseignants
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                À propos
              </Link>
              <Link href="/faq" className="hover:text-slate-300 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-slate-300 transition-colors">
                Contact
              </Link>
              <Link href="/legal" className="hover:text-slate-300 transition-colors">
                Mentions Légales & RGPD
              </Link>
              <Link href="/admin/login" className="text-zinc-600 hover:text-red-400 transition-colors">
                Accès Faculté
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
