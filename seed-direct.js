const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function main() {
  console.log('🌱 Memulai Seeding Database...\n');

  // 1. Seed Settings
  console.log('📝 Seeding Settings...');
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      school_name: 'SIAKAD UNIVERSITAS PRISMA',
      school_logo_url: '/Wikimedia-logo.png'
    }
  });
  console.log('✅ Settings seeded:', settings.school_name);

  // 2. Seed Program Studi
  console.log('\n📚 Seeding Program Studi...');
  const prodis = [
    { nama_prodi: 'Teknik Informatika', kode_prodi: 'IF', fakultas: 'Teknik' },
    { nama_prodi: 'Sistem Informasi', kode_prodi: 'SI', fakultas: 'Teknik' },
    { nama_prodi: 'Manajemen', kode_prodi: 'MNJ', fakultas: 'Ekonomi & Bisnis' },
    { nama_prodi: 'Akuntansi', kode_prodi: 'AK', fakultas: 'Ekonomi & Bisnis' },
  ];

  for (const prodi of prodis) {
    await prisma.programStudi.upsert({
      where: { kode_prodi: prodi.kode_prodi },
      update: {},
      create: prodi
    });
    console.log(`  ✅ ${prodi.nama_prodi} (${prodi.kode_prodi})`);
  }

  console.log('\n✨ Seeding Selesai!');
  
  // Tampilkan ringkasan
  console.log('\n📊 Ringkasan Database:');
  const settingsCount = await prisma.settings.count();
  const prodiCount = await prisma.programStudi.count();
  const mahasiswaCount = await prisma.mahasiswa.count();
  const dosenCount = await prisma.dosen.count();
  const profileCount = await prisma.profile.count();
  
  console.log(`  - Settings: ${settingsCount} record`);
  console.log(`  - Program Studi: ${prodiCount} records`);
  console.log(`  - Mahasiswa: ${mahasiswaCount} records`);
  console.log(`  - Dosen: ${dosenCount} records`);
  console.log(`  - Profiles: ${profileCount} records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
