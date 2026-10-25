import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SpotlightGrid from '@/components/SpotlightGrid';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'MedQuiz — Master Medical Exams. Zero Fluff.', template: '%s | MedQuiz' },
  description:
    'Instant static board questions and AI-generated clinical vignettes. Zero noise, high performance.',
  keywords: ['medical quiz', 'USMLE', 'anatomy', 'pharmacology', 'clinical vignettes', 'AI quiz'],
  openGraph: {
    title: 'MedQuiz — Master Medical Exams. Zero Fluff.',
    description: 'Instant static board questions and AI-generated clinical vignettes.',
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-[#111111] text-slate-100">
        <SpotlightGrid />
        <Navbar />
        <main className="relative z-10 flex flex-1 flex-col pt-14">{children}</main>
        <footer className="relative z-10 border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
          © {CURRENT_YEAR} MedQuiz · Minimalist Medical Learning
        </footer>
      </body>
    </html>
  );
}
