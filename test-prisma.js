require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');
    
    // Test query
    const settings = await prisma.settings.findFirst();
    console.log('Settings:', settings);
    
    const programStudi = await prisma.programStudi.findMany();
    console.log('Program Studi count:', programStudi.length);
    
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
