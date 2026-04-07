const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function resetDatabase() {
  try {
    console.log('🔄 Resetting Database...\n');
    
    // Hapus semua data (urutan penting karena foreign key constraints)
    console.log('🗑️  Menghapus semua data...');
    await prisma.mahasiswa.deleteMany();
    console.log('  ✅ Mahasiswa deleted');
    
    await prisma.dosen.deleteMany();
    console.log('  ✅ Dosen deleted');
    
    await prisma.profile.deleteMany();
    console.log('  ✅ Profile deleted');
    
    await prisma.programStudi.deleteMany();
    console.log('  ✅ Program Studi deleted');
    
    await prisma.settings.deleteMany();
    console.log('  ✅ Settings deleted');
    
    console.log('\n✅ Database berhasil direset!\n');
    
    // Tampilkan ringkasan
    console.log('📊 Ringkasan Database (setelah reset):');
    const settingsCount = await prisma.settings.count();
    const prodiCount = await prisma.programStudi.count();
    const mahasiswaCount = await prisma.mahasiswa.count();
    const dosenCount = await prisma.dosen.count();
    const profileCount = await prisma.profile.count();
    
    console.log(`  - Settings: ${settingsCount} records`);
    console.log(`  - Program Studi: ${prodiCount} records`);
    console.log(`  - Mahasiswa: ${mahasiswaCount} records`);
    console.log(`  - Dosen: ${dosenCount} records`);
    console.log(`  - Profiles: ${profileCount} records`);
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
