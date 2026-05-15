import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '../../_components/Topbar';
import type { Database } from '@/types/database';

type Customer = Database['public']['Tables']['customers']['Row'];
type EpisodeSummary = Pick<
  Database['public']['Tables']['episodes']['Row'],
  'id' | 'title' | 'status' | 'recorded_at' | 'current_version'
>;

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }
  const customer = data as Customer;

  const { data: episodesData } = await supabase
    .from('episodes')
    .select('id, title, status, recorded_at, current_version')
    .eq('customer_id', id)
    .order('recorded_at', { ascending: false });

  const episodes = (episodesData ?? []) as unknown as EpisodeSummary[];

  const initials = customer.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Topbar
        title={customer.name}
        subtitle={customer.email}
        actions={
          <Link
            href="/admin/customers"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-colors font-[family-name:var(--font-en)]"
          >
            ← לרשימה
          </Link>
        }
      />

      {/* Profile card */}
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bunker-red to-bunker-red-dark flex items-center justify-center text-white text-xl font-bold font-[family-name:var(--font-en)]">
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold">{customer.name}</div>
            <div className="text-sm text-white/50 mt-1 font-[family-name:var(--font-en)]">
              {customer.email}
            </div>
            <div className="text-sm text-white/50 font-[family-name:var(--font-en)]">
              +{customer.whatsapp}
            </div>
          </div>
          <div className="text-left text-xs text-white/40 font-[family-name:var(--font-en)]">
            <div>הצטרף: {new Date(customer.created_at).toLocaleDateString('he-IL')}</div>
            <div className="mt-1">מסלול: {customer.package}</div>
          </div>
        </div>

        {customer.notes && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 font-[family-name:var(--font-en)]">
              הערות פנימיות
            </div>
            <p className="text-sm text-white/70 whitespace-pre-wrap">{customer.notes}</p>
          </div>
        )}
      </div>

      {/* Episodes section */}
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            פרקים <span className="text-white/40 font-normal">({episodes.length})</span>
          </h2>
          <Link
            href={`/admin/episodes/new?customer=${id}`}
            className="px-3 py-1.5 bg-bunker-red hover:bg-bunker-red-dark text-white text-xs font-bold rounded-lg transition-colors"
          >
            + פרק חדש
          </Link>
        </div>

        {episodes.length === 0 ? (
          <div className="py-8 text-center text-sm text-white/40">
            עדיין אין פרקים ללקוח הזה
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {episodes.map((ep) => (
              <li
                key={ep.id}
                className="py-3 flex items-center justify-between hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/episodes/${ep.id}`}
                    className="font-bold text-white hover:text-red-300 transition-colors truncate block"
                  >
                    {ep.title}
                  </Link>
                  <div className="text-xs text-white/40 font-[family-name:var(--font-en)]">
                    {new Date(ep.recorded_at).toLocaleDateString('he-IL')} · V{ep.current_version}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-white/60 font-[family-name:var(--font-en)]">
                  {ep.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
