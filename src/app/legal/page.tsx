import type { Metadata } from 'next';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales & Confidentialité',
  description: 'Politique de confidentialité, respect des données médicales et conditions d’utilisation de MedQuiz.',
};

export default function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 space-y-8 animate-fade-in text-slate-100">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
          <span>Cadre Juridique & RGPD</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Mentions Légales & Confidentialité</h1>
        <p className="text-xs text-zinc-400">Dernière mise à jour : Octobre 2026</p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-red-500" />
          <span>1. Éditeur de la Plateforme</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          La plateforme <strong>MedQuiz</strong> est un outil pédagogique libre dédié à la formation continue et initiale des étudiants en médecine et professionnels de santé.
        </p>
        <p className="text-xs text-zinc-400">
          Contact éditorial et modération médicale : contact@medquiz.fr
        </p>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-teal-400" />
          <span>2. Protection des Données Personnelles (RGPD)</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          En <strong>Mode Invité</strong>, aucune information personnelle n&apos;est transmise ni stockée sur nos serveurs. L&apos;ensemble des données d&apos;évaluation, historique et scores est exclusivement consigné dans le stockage local de votre navigateur (localStorage).
        </p>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          En cas de création de compte étudiant, les seules informations conservées sont l&apos;adresse email et le niveau d&apos;étude déclaré, strictement aux fins de synchronisation multi-appareils. Aucune donnée n&apos;est transmise à des tiers ou laboratoires.
        </p>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          <span>3. Avertissement Médical & Portée Pédagogique</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Les questions, cas cliniques et explications fournis sur MedQuiz sont conçus à des fins strictes d&apos;entraînement aux examens académiques. Ils ne constituent en aucun cas une recommandation thérapeutique directe ni un avis médical pour des patients réels.
        </p>
      </div>
    </div>
  );
}
