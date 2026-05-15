import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '../../_components/Topbar';

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: episode, error } = await supabase
    .from('episodes')
    .select('*, customer:customers(id, name, email)')
    .eq('id', id)
    .single();

  if (error || !episode) {
    notFound();
  }

  const customer = episode.customer as { id: string; name: string; email: string } | null;

  return (
    <>
      <Topbar
        title={episode.title}
        subtitle={
          customer
            ? `${customer.name} · הוקלט ${new Date(episode.recorded_at).toLocaleDateString('he-IL')}`
            : undefined
        }
        actions={
          <Link
            href="/admin/episodes"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-colors font-[family-name:var(--font-en)]"
          >
            ← לרשימה
          </Link>
        }
      />

      <div className="bg-[#181818] border border-white/10 rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-xl font-bold mb-2">העלאת וידאו תהיה זמינה ב-Sprint 3</h2>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          הפרק נוצר במערכת בהצלחה (סטטוס: <span className="text-white">{episode.status}</span>).
          בספרינט הבא נחבר את Bunny TUS upload, נגן וידאו, ויצירת share token לפורטל הלקוח.
        </p>
      </div>
    </>
  );
}
