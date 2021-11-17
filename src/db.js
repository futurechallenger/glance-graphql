import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function queryUser(name) {
  if (!sql) {
    throw new Error('Empty sql statement');
  }

  try {
    const condition = name ? { contains: name } : null;
    const users = await prisma.user.findMany({
      where: { OR: [{ name: condition }, { email: condition }] },
    });
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}
