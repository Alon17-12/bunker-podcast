'use client';

import { useState, useTransition } from 'react';
import { signIn } from './actions';

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
          placeholder="alon@bunker.co.il"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          סיסמה
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          minLength={6}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
          placeholder="••••••••"
        />
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
            מתחבר...
          </>
        ) : (
          <>התחבר ←</>
        )}
      </button>
    </form>
  );
}
