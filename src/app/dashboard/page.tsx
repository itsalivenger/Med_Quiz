import StatsOverview from '@/components/StatsOverview';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: 'Suivez votre historique de révision, votre précision par matière et ciblez vos points faibles.',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <StatsOverview />
    </div>
  );
}
