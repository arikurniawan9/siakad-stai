const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Direct connection to port 5432
const connectionString = "postgresql://postgres:q9GhEUAmMOPWzLnN@db.swdgtxkeemdrmqaecvhb.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('--- Memulai Migrasi & Seeding ---');
    await client.connect();
    console.log('✅ Terhubung ke PostgreSQL Supabase');

    const sqlPath = path.join(__dirname, 'supabase_setup.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    const settingsSql = `
      CREATE TABLE IF NOT EXISTS public.settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        school_name TEXT DEFAULT 'SIAKAD UNIVERSITAS',
        school_logo_url TEXT DEFAULT '/Wikimedia-logo.png',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT one_row_only CHECK (id = 1)
      );
      ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
      CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
    `;

    console.log('⏳ Sedang menjalankan skema...');
    await client.query(settingsSql);
    await client.query(sql);
    console.log('✅ Skema berhasil dibuat');

    console.log('⏳ Memasukkan pengaturan default...');
    await client.query(`
      INSERT INTO public.settings (id, school_name, school_logo_url)
      VALUES (1, 'SIAKAD UNIVERSITAS', '/Wikimedia-logo.png')
      ON CONFLICT (id) DO UPDATE SET school_name = 'SIAKAD UNIVERSITAS';
    `);
    console.log('✅ Pengaturan default dimasukkan');

    console.log('--- Migrasi Selesai ---');
  } catch (err) {
    console.error('❌ Terjadi kesalahan:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
