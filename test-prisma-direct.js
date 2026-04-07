// Test koneksi Prisma dengan hardcoded connection string
const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma connection...');
    console.log('Using DATABASE_URL:', DATABASE_URL.substring(0, 60) + '...');
    
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');
    
    // Test query
    const settings = await prisma.settings.findFirst();
    console.log('\n📊 Settings:');
    console.log('  - School:', settings?.school_name);
    console.log('  - Logo:', settings?.school_logo_url);
    
    const programStudi = await prisma.programStudi.findMany();
    console.log('\n📚 Program Studi:', programStudi.length, 'records');
    programStudi.forEach(p => {
      console.log(`  - ${p.nama_prodi} (${p.kode_prodi})`);
    });
    
    const mahasiswa = await prisma.mahasiswa.findMany();
    console.log('\n👨‍🎓 Mahasiswa:', mahasiswa.length, 'records');
    
    const dosen = await prisma.dosen.findMany();
    console.log('\n👨‍🏫 Dosen:', dosen.length, 'records');
    
    const profiles = await prisma.profile.findMany();
    console.log('\n👤 Profiles:', profiles.length, 'records');
    
  } catch (error) {
    console.error('\n❌ Prisma connection failed:', error.message);
    if (error.message.includes('Tenant')) {
      console.log('\n💡 Kemungkinan user/password salah atau host tidak sesuai');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
