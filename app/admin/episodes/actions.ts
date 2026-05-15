'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { episodeCreateSchema } from '@/lib/validation/schemas';

export async function createEpisode(formData: FormData) {
  const raw = {
    customer_id: formData.get('customer_id'),
    title: formData.get('title'),
    episode_number: formData.get('episode_number')
      ? Number(formData.get('episode_number'))
      : null,
    recorded_at: formData.get('recorded_at'),
  };

  const parsed = episodeCreateSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat().filter(Boolean)[0];
    return { error: (firstError as string | undefined) ?? 'נתונים שגויים' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('episodes')
    .insert({
      ...parsed.data,
      episode_number: parsed.data.episode_number ?? null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/episodes');
  revalidatePath('/admin');
  revalidatePath(`/admin/customers/${parsed.data.customer_id}`);
  redirect(`/admin/episodes/${data.id}` as never);
}
