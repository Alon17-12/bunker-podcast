import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'התחברות · הבונקר',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(params.redirectTo || '/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="rec-dot" />
            <h1 className="text-3xl font-black tracking-tight">הבונקר</h1>
          </div>
          <p className="text-xs uppercase tracking-[3px] text-white/40 font-[family-name:var(--font-en)]">
            Admin Console
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-1">ברוך הבא חזרה</h2>
          <p className="text-sm text-white/50 mb-6">התחבר כדי לגשת לפאנל הניהול</p>
          <LoginForm redirectTo={params.redirectTo} initialError={params.error} />
        </div>

        <p className="text-center text-[10px] text-white/30 mt-6 uppercase tracking-[2px] font-[family-name:var(--font-en)]">
          🔒 רק לצוות הבונקר · אם איבדת סיסמה — פנה לאלון
        </p>
      </div>
    </main>
  );
}
