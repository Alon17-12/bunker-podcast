import { createClient } from '@/lib/supabase/server';
import { Topbar } from './_components/Topbar';

export const metadata = {
  title: 'Dashboard · הבונקר',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get counts in parallel
  const [customers, episodes, reels, feedback] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('episodes').select('id', { count: 'exact', head: true }),
    supabase.from('reels').select('id', { count: 'exact', head: true }),
    supabase
      .from('feedback_items')
      .select('id', { count: 'exact', head: true })
      .eq('resolved', false),
  ]);

  const stats = [
    { label: 'לקוחות', value: customers.count ?? 0, hint: 'סה"כ' },
    { label: 'פרקים', value: episodes.count ?? 0, hint: 'בכל הסטטוסים' },
    { label: 'Reels', value: reels.count ?? 0, hint: 'סה"כ' },
    { label: 'תיקונים פתוחים', value: feedback.count ?? 0, hint: 'לא נפתרו' },
  ];

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="ברוך הבא חזרה · המערכת מוכנה לעבודה"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#181818] border border-white/10 rounded-2xl p-5"
          >
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-white/40 mb-2 font-[family-name:var(--font-en)]">
              {s.label}
            </div>
            <div className="text-3xl font-black tracking-tight font-[family-name:var(--font-en)]">
              {s.value}
            </div>
            <div className="text-[10px] text-white/40 mt-1 font-[family-name:var(--font-en)]">
              {s.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">🎙️</div>
        <h2 className="text-xl font-bold mb-2">המערכת ריקה — עוד אין פרקים</h2>
        <p className="text-sm text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
          התחל בהוספת לקוח ראשון, ואז העלה את הפרק הראשון. ברגע שהפרק מוכן —
          המערכת תייצר לינק שיתוף עם פורטל מלא ללקוח.
        </p>
        <div className="flex items-center justify-center gap-2">
          <a
            href="/admin/customers/new"
            className="px-5 py-2.5 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors"
          >
            + הוסף לקוח ראשון
          </a>
          <a
            href="/admin/customers"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm font-medium rounded-lg transition-colors"
          >
            כל הלקוחות
          </a>
        </div>
      </div>
    </>
  );
}
