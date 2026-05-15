import { createAdminClient } from '@/lib/supabase/admin';

async function getDbStatus() {
  try {
    const supabase = createAdminClient();
    const tables = ['customers', 'episodes', 'episode_versions', 'reels', 'feedback_items'];
    const results = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase
          .from(table as 'customers')
          .select('id', { count: 'exact', head: true });
        return { table, ok: !error };
      })
    );
    const okCount = results.filter((r) => r.ok).length;
    return { connected: true, tables: results, okCount, total: tables.length };
  } catch {
    return { connected: false, tables: [], okCount: 0, total: 5 };
  }
}

async function getBunnyStatus() {
  try {
    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;
    if (!libraryId || !apiKey) return { connected: false, videos: 0 };
    const res = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=1`,
      {
        headers: { AccessKey: apiKey, accept: 'application/json' },
        cache: 'no-store',
      }
    );
    if (!res.ok) return { connected: false, videos: 0 };
    const data: { totalItems: number } = await res.json();
    return { connected: true, videos: data.totalItems };
  } catch {
    return { connected: false, videos: 0 };
  }
}

export default async function HomePage() {
  const [db, bunny] = await Promise.all([getDbStatus(), getBunnyStatus()]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="rec-dot" />
          <h1 className="text-5xl font-black tracking-tight text-white">
            הבונקר
          </h1>
        </div>

        <div className="text-xs font-bold uppercase tracking-[3px] text-white/60 mb-8 font-[family-name:var(--font-en)]">
          Podcast Studio Management System
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-2xl font-bold mb-3">🎙️ המערכת קמה לחיים</div>
          <p className="text-white/70 leading-relaxed mb-6">
            תשתית מאותחלת. Next.js 15 + TypeScript Strict + Tailwind v4 + Supabase + Bunny Stream.
          </p>

          {/* Stack status */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
            <StatusCheck label="Next.js" value="15.1" ok />
            <StatusCheck label="TypeScript" value="Strict" ok />
            <StatusCheck label="Tailwind" value="v4" ok />
          </div>

          {/* DB status */}
          <div
            className={`rounded-xl p-5 mb-3 text-right ${
              db.connected
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-[family-name:var(--font-en)]">
                {db.connected ? '● Supabase Connected' : '○ Supabase Offline'}
              </div>
              <div className="text-xs text-white/50 font-[family-name:var(--font-en)]">
                {db.okCount}/{db.total} tables
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {db.tables.map((t) => (
                <div
                  key={t.table}
                  className={`text-[10px] py-2 rounded-md text-center font-[family-name:var(--font-code)] ${
                    t.ok
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-red-500/15 text-red-300'
                  }`}
                  title={t.table}
                >
                  {t.ok ? '✓' : '✗'} {t.table.split('_')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Bunny status */}
          <div
            className={`rounded-xl p-5 mb-6 text-right flex items-center justify-between ${
              bunny.connected
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-[family-name:var(--font-en)]">
              {bunny.connected ? '🐰 Bunny Stream Connected' : '○ Bunny Offline'}
            </div>
            <div className="text-xs text-white/50 font-[family-name:var(--font-en)]">
              {bunny.videos} videos
            </div>
          </div>

          <div className="text-[10px] text-white/40 uppercase tracking-[2px] font-[family-name:var(--font-en)]">
            Sprint 1 · Foundation Complete · 15.05.2026
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusCheck({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className={`bg-black/40 border rounded-lg py-3 ${ok ? 'border-emerald-500/30' : 'border-white/10'}`}>
      <div className="text-white font-bold font-[family-name:var(--font-en)]">{value}</div>
      <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1 font-[family-name:var(--font-en)]">
        {label}
      </div>
    </div>
  );
}
