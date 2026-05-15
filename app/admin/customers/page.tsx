import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '../_components/Topbar';

export const metadata = {
  title: 'לקוחות · הבונקר',
};

const PACKAGE_LABEL: Record<string, string> = {
  photo_only: 'צילום בלבד',
  photo_edit: 'צילום + עריכה',
  retainer: 'ריטיינר',
};

const PACKAGE_COLOR: Record<string, string> = {
  photo_only: 'bg-white/5 text-white/70 border-white/10',
  photo_edit: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  retainer: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <>
      <Topbar
        title="לקוחות"
        subtitle={`סה"כ ${customers?.length ?? 0} לקוחות`}
        actions={
          <Link
            href="/admin/customers/new"
            className="px-4 py-2 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            לקוח חדש
          </Link>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
          ⚠ {error.message}
        </div>
      )}

      {!customers || customers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/10 text-[10px] font-bold uppercase tracking-[1.5px] text-white/40 font-[family-name:var(--font-en)]">
            <div>לקוח</div>
            <div>מסלול</div>
            <div className="hidden md:block">WhatsApp</div>
            <div>תאריך הצטרפות</div>
            <div></div>
          </div>
          <ul>
            {customers.map((c) => (
              <li
                key={c.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{c.name}</div>
                  <div className="text-xs text-white/40 truncate font-[family-name:var(--font-en)]">
                    {c.email}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border font-[family-name:var(--font-en)] ${
                    PACKAGE_COLOR[c.package] ?? PACKAGE_COLOR.photo_edit
                  }`}
                >
                  {PACKAGE_LABEL[c.package] ?? c.package}
                </span>

                <div className="hidden md:block text-xs text-white/50 font-[family-name:var(--font-en)]">
                  {formatWhatsApp(c.whatsapp)}
                </div>

                <div className="text-xs text-white/40 font-[family-name:var(--font-en)]">
                  {new Date(c.created_at).toLocaleDateString('he-IL')}
                </div>

                <Link
                  href={`/admin/customers/${c.id}` as never}
                  className="px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  פתח ←
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function formatWhatsApp(num: string) {
  // 972541234567 → +972 54-123-4567
  if (num.startsWith('972') && num.length >= 11) {
    return `+972 ${num.slice(3, 5)}-${num.slice(5, 8)}-${num.slice(8)}`;
  }
  return num;
}

function EmptyState() {
  return (
    <div className="bg-[#181818] border border-white/10 rounded-2xl p-12 text-center">
      <div className="text-5xl mb-4">👥</div>
      <h2 className="text-xl font-bold mb-2">עוד אין לקוחות</h2>
      <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
        כל לקוח חדש יקבל פרופיל עם היסטוריית פרקים. תוסיף לקוח ראשון כדי להתחיל.
      </p>
      <Link
        href="/admin/customers/new"
        className="inline-block px-5 py-2.5 bg-bunker-red hover:bg-bunker-red-dark text-white text-sm font-bold rounded-lg transition-colors"
      >
        + לקוח ראשון
      </Link>
    </div>
  );
}
