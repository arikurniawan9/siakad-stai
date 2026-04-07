const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Menggunakan Pooler port 6543 untuk stabilitas koneksi eksternal
const connectionString = "postgresql://postgres:q9GhEUAmMOPWzLnN@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function resetDatabase() {
  try {
    console.log('🚀 MEMULAI RESET DATABASE SIAKAD...');
    await client.connect();
    console.log('✅ Terhubung ke database Supabase');

    const sqlPath = path.join(__dirname, 'setup_final.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Sedang menghapus tabel lama dan memasang skema baru...');
    await client.query(sql);
    
    console.log('\n✨ DATABASE BERHASIL DI-RESET TOTAL! ✨');
    console.log('-------------------------------------------');
    console.log('Langkah selanjutnya:');
    console.log('1. Pastikan Anda sudah menghapus user lama di dashboard Supabase (Authentication > Users).');
    console.log('2. Buka halaman SIGN UP di aplikasi Anda.');
    console.log('3. Daftar dengan email apa saja.');
    console.log('4. Akun tersebut otomatis akan menjadi ADMIN PERTAMA.');
    console.log('-------------------------------------------');

  } catch (err) {
    console.error('❌ Terjadi kesalahan saat reset:', err.message);
  } finally {
    await client.end();
  }
}

resetDatabase();
