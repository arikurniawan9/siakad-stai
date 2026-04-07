'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Kita butuh admin client (service role) untuk membuat user tanpa konfirmasi email
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function createUser(values) {
  const { email, password, name, role } = values;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: role }
  });

  if (error) throw new Error(error.message);

  // Trigger on_auth_user_created di DB akan otomatis membuat profile.
  // Tapi kita update lagi untuk memastikan role-nya sesuai pilihan admin.
  if (data.user) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: role, nama_lengkap: name })
      .eq('id', data.user.id);
    
    if (profileError) throw new Error(profileError.message);
  }

  revalidatePath('/users');
  return { success: true };
}

export async function deleteUser(id) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  revalidatePath('/users');
}
