export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
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
            הפרויקט מאותחל בהצלחה. Next.js 15 + TypeScript Strict + Tailwind v4 (RTL native)
            + Heebo + Inter + JetBrains Mono.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
            <StatusCheck label="Next.js" value="15.0" />
            <StatusCheck label="TypeScript" value="Strict" />
            <StatusCheck label="Tailwind" value="v4" />
          </div>

          <div className="text-[10px] text-white/40 uppercase tracking-[2px] font-[family-name:var(--font-en)]">
            Sprint 1 · Foundation · 14.05.2026
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusCheck({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg py-3">
      <div className="text-white font-bold font-[family-name:var(--font-en)]">{value}</div>
      <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1 font-[family-name:var(--font-en)]">
        {label}
      </div>
    </div>
  );
}
