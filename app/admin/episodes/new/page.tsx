import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '../../_components/Topbar';
import { EpisodeForm } from './episode-form';

export const metadata = {
  title: 'פרק חדש · הבונקר',
};

export default async function NewEpisodePage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')
    .order('name');

  return (
    <>
      <Topbar
        title="פרק חדש"
        subtitle="יצירת פרק חדש"
        actions={
          <Link
            href="/admin/episodes"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-colors font-[family-name:var(--font-en)]"
          >
            ← חזרה
          </Link>
        }
      />

      <div className="max-w-xl bg-[#181818] border border-white/10 rounded-2xl p-8">
        {!customers || customers.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">👥</div>
            <p className="text-sm text-white/60 mb-4">
              צריך לפחות לקוח אחד לפני יצירת פרק
            </p>
            <Link
              href="/admin/customers/new"
              className="inline-block px-5 py-2.5 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors"
            >
              + צור לקוח קודם
            </Link>
          </div>
        ) : (
          <EpisodeForm
            customers={customers}
            preselectedCustomer={params.customer}
          />
        )}
      </div>
    </>
  );
}
