import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function queryUser() {
  if (!sql) {
    throw new Error('Empty sql statement');
  }

  try {
    const users = await prisma.user.findMany();
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}
