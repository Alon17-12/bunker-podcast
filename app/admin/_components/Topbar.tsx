import { signOut } from '@/app/login/actions';

export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && (
          <div className="text-xs text-white/40 mt-1 font-[family-name:var(--font-en)]">
            {subtitle}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <form action={signOut}>
          <button
            type="submit"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-colors font-[family-name:var(--font-en)]"
            title="התנתק"
          >
            ⎋ Logout
          </button>
        </form>
      </div>
    </header>
  );
}
