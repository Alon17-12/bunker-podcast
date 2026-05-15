import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '../_components/Topbar';

export const metadata = {
  title: 'פרקים · הבונקר',
};

const STATUS_COLOR: Record<string, string> = {
  recorded: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
  reviewing: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  sent_v1: 'bg-red-500/10 text-red-300 border-red-500/30',
  revisions_v1: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  sent_v2: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  revisions_v2: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  sent_v3: 'bg-orange-600/10 text-orange-200 border-orange-600/30',
  approved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  archived: 'bg-white/5 text-white/40 border-white/10',
};

const STATUS_LABEL: Record<string, string> = {
  recorded: 'צולם',
  reviewing: 'בסקירה',
  sent_v1: 'נשלח V1',
  revisions_v1: 'תיקונים V1',
  sent_v2: 'נשלח V2',
  revisions_v2: 'תיקונים V2',
  sent_v3: 'נשלח V3 (סופי)',
  approved: 'אושר',
  archived: 'בארכיון',
};

type EpisodeWithCustomer = {
  id: string;
  title: string;
  episode_number: number | null;
  recorded_at: string;
  status: string;
  current_version: number;
  customer: { id: string; name: string } | null;
};

export default async function EpisodesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('episodes')
    .select('id, title, episode_number, recorded_at, status, current_version, customer:customers(id, name)')
    .order('recorded_at', { ascending: false });

  const episodes = (data ?? []) as unknown as EpisodeWithCustomer[];

  return (
    <>
      <Topbar
        title="פרקים"
        subtitle={`סה"כ ${episodes?.length ?? 0} פרקים`}
        actions={
          <Link
            href="/admin/episodes/new"
            className="px-4 py-2 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            פרק חדש
          </Link>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
          ⚠ {error.message}
        </div>
      )}

      {!episodes || episodes.length === 0 ? (
        <div className="bg-[#181818] border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎙️</div>
          <h2 className="text-xl font-bold mb-2">אין עדיין פרקים</h2>
          <p className="text-sm text-white/50 mb-6">תיצור פרק ראשון — שיוך ללקוח, שם, תאריך</p>
          <Link
            href="/admin/episodes/new"
            className="inline-block px-5 py-2.5 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors"
          >
            + פרק ראשון
          </Link>
        </div>
      ) : (
        <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/10 text-[10px] font-bold uppercase tracking-[1.5px] text-white/40 font-[family-name:var(--font-en)]">
            <div>פרק</div>
            <div>לקוח</div>
            <div>סטטוס</div>
            <div>תאריך</div>
            <div></div>
          </div>
          <ul>
            {episodes.map((ep) => {
              const customer = ep.customer;
              return (
                <li
                  key={ep.id}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-b-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/episodes/${ep.id}` as never}
                      className="font-bold text-white hover:text-red-300 transition-colors truncate block"
                    >
                      {ep.title}
                    </Link>
                    {ep.episode_number !== null && (
                      <div className="text-xs text-white/40 font-[family-name:var(--font-en)]">
                        פרק #{ep.episode_number} · V{ep.current_version}
                      </div>
                    )}
                  </div>

                  {customer && (
                    <Link
                      href={`/admin/customers/${customer.id}` as never}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {customer.name}
                    </Link>
                  )}

                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border font-[family-name:var(--font-en)] ${
                      STATUS_COLOR[ep.status] ?? STATUS_COLOR.recorded
                    }`}
                  >
                    {STATUS_LABEL[ep.status] ?? ep.status}
                  </span>

                  <div className="text-xs text-white/40 font-[family-name:var(--font-en)]">
                    {new Date(ep.recorded_at).toLocaleDateString('he-IL')}
                  </div>

                  <Link
                    href={`/admin/episodes/${ep.id}` as never}
                    className="px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    פתח ←
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
