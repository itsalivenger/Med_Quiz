import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SpotlightGrid from '@/components/SpotlightGrid';
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
        <Navbar />
        <main className="relative z-10 flex flex-1 flex-col pt-14">{children}</main>
        <footer className="relative z-10 border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
          © {CURRENT_YEAR} MedQuiz · La plateforme médicale pour étudiants en médecine
        </footer>
      </body>
    </html>
  );
}
