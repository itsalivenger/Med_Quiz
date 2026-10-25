import DashboardView from '@/components/DashboardView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: 'Suivez votre historique de révision, votre précision par matière et ciblez vos points faibles.',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
      <DashboardView />
    </div>
  );
}
