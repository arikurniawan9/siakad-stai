const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function resetAndSeed() {
  try {
    console.log('🔄 Resetting Database dengan Schema Baru...\n');
    
    // Hapus semua data (urutan penting karena foreign key constraints)
    console.log('🗑️  Menghapus semua data...');
    await prisma.transaksi.deleteMany();
    console.log('  ✅ Transaksi deleted');
    
    await prisma.tagihan.deleteMany();
    console.log('  ✅ Tagihan deleted');
    
    await prisma.krs.deleteMany();
    console.log('  ✅ KRS deleted');
    
    await prisma.pertemuanKuliah.deleteMany();
    console.log('  ✅ Pertemuan Kuliah deleted');
    
    await prisma.kelas.deleteMany();
    console.log('  ✅ Kelas deleted');
    
    await prisma.kurikulum.deleteMany();
    console.log('  ✅ Kurikulum deleted');
    
    await prisma.dosen.deleteMany();
    console.log('  ✅ Dosen deleted');
    
    await prisma.mahasiswa.deleteMany();
    console.log('  ✅ Mahasiswa deleted');
    
    await prisma.pendaftar.deleteMany();
    console.log('  ✅ Pendaftar deleted');
    
    await prisma.user.deleteMany();
    console.log('  ✅ User deleted');
    
    await prisma.programStudi.deleteMany();
    console.log('  ✅ Program Studi deleted');
    
    await prisma.tahunAjaran.deleteMany();
    console.log('  ✅ Tahun Ajaran deleted');
    
    await prisma.settings.deleteMany();
    console.log('  ✅ Settings deleted');
    
    console.log('\n✅ Database berhasil direset!\n');
    
    // Seed data baru
    console.log('🌱 Memulai Seeding Database Baru...\n');
    
    // 1. Seed Settings
    console.log('📝 Seeding Settings...');
    await prisma.settings.create({
      data: {
        id: 1,
        school_name: 'SIAKAD UNIVERSITAS PRISMA',
        school_logo_url: '/Wikimedia-logo.png'
      }
    });
    console.log('  ✅ Settings seeded');
    
    // 2. Seed Tahun Ajaran
    console.log('\n📅 Seeding Tahun Ajaran...');
    const tahunAjaran = await prisma.tahunAjaran.create({
      data: {
        tahun: '2025/2026',
        semester: 'Ganjil',
        is_active: true
      }
    });
    console.log('  ✅ Tahun Ajaran seeded:', tahunAjaran.tahun, tahunAjaran.semester);
    
    // 3. Seed Program Studi
    console.log('\n📚 Seeding Program Studi...');
    const prodis = [
      { nama_prodi: 'Teknik Informatika', kode_prodi: 'IF', fakultas: 'Teknik' },
      { nama_prodi: 'Sistem Informasi', kode_prodi: 'SI', fakultas: 'Teknik' },
      { nama_prodi: 'Manajemen', kode_prodi: 'MNJ', fakultas: 'Ekonomi & Bisnis' },
      { nama_prodi: 'Akuntansi', kode_prodi: 'AK', fakultas: 'Ekonomi & Bisnis' },
    ];

    for (const prodi of prodis) {
      await prisma.programStudi.create({
        data: prodi
      });
      console.log(`  ✅ ${prodi.nama_prodi} (${prodi.kode_prodi})`);
    }
    
    console.log('\n✨ Seeding Selesai!\n');
    
    // Tampilkan ringkasan
    console.log('📊 Ringkasan Database:');
    const settingsCount = await prisma.settings.count();
    const tahunAjaranCount = await prisma.tahunAjaran.count();
    const prodiCount = await prisma.programStudi.count();
    const mahasiswaCount = await prisma.mahasiswa.count();
    const dosenCount = await prisma.dosen.count();
    const userCount = await prisma.user.count();
    const kelasCount = await prisma.kelas.count();
    
    console.log(`  - Settings: ${settingsCount} record`);
    console.log(`  - Tahun Ajaran: ${tahunAjaranCount} record`);
    console.log(`  - Program Studi: ${prodiCount} records`);
    console.log(`  - User: ${userCount} records`);
    console.log(`  - Mahasiswa: ${mahasiswaCount} records`);
    console.log(`  - Dosen: ${dosenCount} records`);
    console.log(`  - Kelas: ${kelasCount} records`);
    
    console.log('\n💡 Sekarang buka Prisma Studio dengan: npx prisma studio');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();
