const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://swdgtxkeemdrmqaecvhb.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZGd0eGtlZW1kcm1xYWVjdmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTQ5MTYsImV4cCI6MjA5MTEzMDkxNn0.ce7SQWFhqbqYlqYsOD1GrBc1ABgi1ROFv8ZhuxQ5X0U';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@siakad.com';
  const password = 'admin123';

  console.log(`--- Menyiapkan Akun Admin: ${email} ---`);

  // 1. Create User in Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: 'Super Admin', role: 'admin' }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('ℹ️ User sudah terdaftar di Auth.');
    } else {
      console.error('❌ Error Auth:', authError.message);
      return;
    }
  } else {
    console.log('✅ User Auth berhasil dibuat');
  }

  // 2. Ensure role is set to 'admin' in profiles table
  // The trigger should have handled this, but let's double check/update
  const { data: user } = await supabase.from('profiles').select('id').eq('email', email).single();
  
  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin', nama_lengkap: 'Super Admin' })
      .eq('id', user.id);

    if (profileError) {
      console.error('❌ Error Profile:', profileError.message);
    } else {
      console.log('✅ Role Admin berhasil diset di tabel profiles');
    }
  } else {
    console.error('❌ Profile tidak ditemukan. Pastikan trigger on_auth_user_created sudah jalan.');
  }

  console.log('--- Selesai ---');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

createAdmin();
