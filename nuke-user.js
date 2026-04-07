const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://swdgtxkeemdrmqaecvhb.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZGd0eGtlZW1kcm1xYWVjdmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTQ5MTYsImV4cCI6MjA5MTEzMDkxNn0.ce7SQWFhqbqYlqYsOD1GrBc1ABgi1ROFv8ZhuxQ5X0U';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function nukeUser(email) {
  console.log(`--- Menghapus user: ${email} dari sistem Autentikasi ---`);
  
  // 1. Cari User ID berdasarkan email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log(`❌ Email ${email} tidak ditemukan di sistem Autentikasi Supabase.`);
    console.log('💡 Ini aneh. Coba daftar dengan email BARU (misal: admin-baru@gmail.com) untuk tes.');
    return;
  }

  // 2. Hapus secara paksa
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('❌ Gagal menghapus:', deleteError.message);
  } else {
    console.log(`✅ BERHASIL! Email ${email} telah dihapus total dari sistem.`);
    console.log('🚀 Sekarang silakan kembali ke halaman SIGN UP dan daftar ulang.');
  }
}

// Ganti dengan email yang ingin Anda bersihkan
nukeUser('admin@siakad.com');
