import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://postgres.swdgtxkeemdrmqaecvhb:q9GhEUAmMOPWzLnN@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
