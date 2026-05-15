'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { customerCreateSchema } from '@/lib/validation/schemas';

export async function createCustomer(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    whatsapp: formData.get('whatsapp'),
    package: formData.get('package') || 'photo_edit',
    notes: (formData.get('notes') as string) || null,
  };

  const parsed = customerCreateSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError =
      Object.values(errors).flat().filter(Boolean)[0] ?? 'נתונים שגויים';
    return { error: firstError };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .insert(parsed.data)
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'לקוח עם המייל הזה כבר קיים' };
    }
    return { error: error.message };
  }

  revalidatePath('/admin/customers');
  revalidatePath('/admin');
  const { id } = data as { id: string };
  redirect(`/admin/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/customers');
  revalidatePath('/admin');
  return { ok: true };
}

export type CustomerFormError = z.inferFlattenedErrors<
  typeof customerCreateSchema
>;
