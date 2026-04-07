// Script untuk verifikasi database - menampilkan semua data
const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function showAllData() {
  try {
    console.log('📊 DATABASE CONTENT\n');
    console.log('='.repeat(60));
    
    // Settings
    console.log('\n📝 SETTINGS:');
    const settings = await prisma.settings.findMany();
    console.table(settings);
    
    // Tahun Ajaran
    console.log('\n📅 TAHUN AJARAN:');
    const tahunAjaran = await prisma.tahunAjaran.findMany();
    console.table(tahunAjaran);
    
    // Program Studi
    console.log('\n📚 PROGRAM STUDI:');
    const prodi = await prisma.programStudi.findMany();
    console.table(prodi);
    
    // Users
    console.log('\n👤 USERS:');
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      console.log('  (belum ada data)');
    } else {
      console.table(users);
    }
    
    // Mahasiswa
    console.log('\n👨‍🎓 MAHASISWA:');
    const mahasiswa = await prisma.mahasiswa.findMany();
    if (mahasiswa.length === 0) {
      console.log('  (belum ada data)');
    } else {
      console.table(mahasiswa);
    }
    
    // Dosen
    console.log('\n👨‍🏫 DOSEN:');
    const dosen = await prisma.dosen.findMany();
    if (dosen.length === 0) {
      console.log('  (belum ada data)');
    } else {
      console.table(dosen);
    }
    
    // Kelas
    console.log('\n🏫 KELAS:');
    const kelas = await prisma.kelas.findMany();
    if (kelas.length === 0) {
      console.log('  (belum ada data)');
    } else {
      console.table(kelas);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showAllData();
