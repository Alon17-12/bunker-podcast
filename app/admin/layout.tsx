import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from './_components/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get current pathname from headers (middleware sets x-pathname or we infer)
  const hdrs = await headers();
  const activePath = hdrs.get('x-pathname') ?? '/admin';

  return (
    <div className="min-h-screen flex bg-[#0f0f0f]">
      <Sidebar activePath={activePath} user={{ email: user.email ?? null }} />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-[1280px] mx-auto px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
