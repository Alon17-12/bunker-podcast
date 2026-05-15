'use client';

import { useState, useTransition } from 'react';
import { createCustomer } from '../actions';

export function CustomerForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCustomer(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <Field label="שם מלא" name="name" required placeholder="לדוגמה: דניאל כהן" autoFocus />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        placeholder="daniel@example.com"
        ltr
      />
      <Field
        label="WhatsApp"
        name="whatsapp"
        type="tel"
        required
        placeholder="972541234567"
        ltr
        hint="פורמט בינלאומי ללא + (חייב להתחיל ב-972)"
      />

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          מסלול
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: 'photo_only', l: 'צילום בלבד' },
            { v: 'photo_edit', l: 'צילום + עריכה' },
            { v: 'retainer', l: 'ריטיינר' },
          ].map((opt, i) => (
            <label
              key={opt.v}
              className="flex items-center justify-center px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition-colors text-sm has-[:checked]:bg-bunker-red/15 has-[:checked]:border-bunker-red has-[:checked]:text-red-300 has-[:checked]:font-bold"
            >
              <input
                type="radio"
                name="package"
                value={opt.v}
                defaultChecked={i === 1}
                className="sr-only"
              />
              {opt.l}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
          הערות פנימיות (אופציונלי)
        </label>
        <textarea
          name="notes"
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors resize-y"
          placeholder="כל מידע שחשוב לזכור על הלקוח..."
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
            יוצר...
          </>
        ) : (
          'צור לקוח →'
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  autoFocus,
  ltr,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  ltr?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-[family-name:var(--font-en)]">
        {label}
        {required && <span className="text-bunker-red mr-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        autoFocus={autoFocus}
        placeholder={placeholder}
        dir={ltr ? 'ltr' : 'auto'}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-bunker-red focus:outline-none transition-colors"
      />
      {hint && <div className="text-[11px] text-white/40 mt-1">{hint}</div>}
    </div>
  );
}
