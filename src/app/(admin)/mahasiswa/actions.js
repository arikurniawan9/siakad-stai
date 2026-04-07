'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function bulkDeleteMahasiswa(ids) {
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').delete().in('id', ids);
  
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/mahasiswa');
}

export async function deleteMahasiswa(id) {
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/mahasiswa');
}
