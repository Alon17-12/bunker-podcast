import Link from 'next/link';

type NavGroup = {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
};

const NAV: NavGroup[] = [
  {
    label: 'ראשי',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        href: '/admin/customers',
        label: 'לקוחות',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        href: '/admin/episodes',
        label: 'פרקים',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        ),
      },
    ],
  },
];

export function Sidebar({
  activePath,
  user,
}: {
  activePath: string;
  user: { email: string | null };
}) {
  const initials = (user.email ?? 'AG').slice(0, 2).toUpperCase();
  return (
    <aside className="w-[260px] bg-black border-l border-white/10 flex flex-col p-4 sticky top-0 h-screen">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-3 px-3 mb-9">
        <span className="rec-dot" />
        <span className="text-xl font-black tracking-tight text-white">הבונקר</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-6">
        {NAV.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-white/40 px-3 mb-2 font-[family-name:var(--font-en)]">
              {group.label}
            </div>
            <ul>
              {group.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? activePath === '/admin'
                    : activePath.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href as never}
                      className={[
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                        isActive
                          ? 'bg-bunker-red/15 text-red-300 font-bold'
                          : 'text-white/60 hover:bg-white/5 hover:text-white',
                      ].join(' ')}
                    >
                      {isActive && (
                        <span className="absolute right-0 top-2 bottom-2 w-[3px] bg-bunker-red rounded" />
                      )}
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-auto bg-bunker-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-[family-name:var(--font-en)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bunker-red to-bunker-red-dark flex items-center justify-center text-white text-xs font-bold font-[family-name:var(--font-en)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user.email ?? 'Admin'}</div>
            <div className="text-[10px] text-white/40">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
