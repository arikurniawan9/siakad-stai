'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSchoolName(newName) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('settings')
    .update({ school_name: newName, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function updateSchoolLogo(logoUrl) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('settings')
    .update({ school_logo_url: logoUrl, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}
