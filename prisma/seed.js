const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai Seeding...');

  // 1. Seed Settings
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      school_name: 'SIAKAD UNIVERSITAS PRISMA',
      school_logo_url: '/Wikimedia-logo.png'
    }
  });
  console.log('✅ Settings seeded');

  // 2. Seed Default Program Studi (Contoh)
  const prodis = [
    { nama_prodi: 'Teknik Informatika', kode_prodi: 'IF', fakultas: 'Teknik' },
    { nama_prodi: 'Sistem Informasi', kode_prodi: 'SI', fakultas: 'Teknik' },
  ];

  for (const prodi of prodis) {
    await prisma.programStudi.upsert({
      where: { kode_prodi: prodi.kode_prodi },
      update: {},
      create: prodi
    });
  }
  console.log('✅ Program Studi seeded');

  console.log('✨ Seeding Selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
