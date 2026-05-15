'use client';

import { useState, useTransition } from 'react';
import { createEpisode } from '../actions';

export function EpisodeForm({
  customers,
  preselectedCustomer,
}: {
  customers: { id: string; name: string }[];
  preselectedCustomer?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createEpisode(formData);
      if (result?.error) setError(result.error);
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form action={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          לקוח <span className="text-bunker-red mr-1">*</span>
        </label>
        <select
          name="customer_id"
          required
          defaultValue={preselectedCustomer ?? ''}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
        >
          <option value="">בחר לקוח...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          שם הפרק <span className="text-bunker-red mr-1">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="לדוגמה: איך בונים סטארטאפ ב-2026"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
            מספר פרק (אופציונלי)
          </label>
          <input
            type="number"
            name="episode_number"
            min={1}
            placeholder="24"
            dir="ltr"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
            תאריך הקלטה <span className="text-bunker-red mr-1">*</span>
          </label>
          <input
            type="date"
            name="recorded_at"
            required
            defaultValue={today}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg px-4 py-3">
          ⚠ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-bunker-red hover:bg-bunker-red-dark text-white font-bold rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            יוצר...
          </>
        ) : (
          'צור פרק →'
        )}
      </button>
    </form>
  );
}
