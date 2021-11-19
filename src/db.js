import client from '@prisma/client';
const { PrismaClient } = client;

const prisma = new PrismaClient();

async function createUser({ name, email }) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return user;
  } catch (e) {
  } finally {
    prisma.$disconnect();
  }
}

async function findUserById(userId) {
  try {
    const users = await prisma.user.findUnique({
      where: { id: userId },
    });
    return users;
  } catch (e) {
    console.error('ERROR: ', e);
  } finally {
    prisma.$disconnect();
  }
}

async function findUserByName(name) {
  try {
    const condition = name
      ? {
          where: {
            OR: [{ name: { contains: name } }, { email: { contains: name } }],
          },
        }
      : null;
    const users = await prisma.user.findMany(condition);
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });

    return post;
  } catch (e) {
  } finally {
    prisma.$disconnect();
  }
}

async function findPostById(postId) {
  try {
    const users = await prisma.post.findUnique({
      where: { id: postId },
    });
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

async function findAllPosts() {
  try {
    const posts = await prisma.post.findMany();
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

async function findEnvById(envId) {
  try {
    const users = await prisma.environment.findMany({
      where: { id: { equals: envId } },
    });
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

async function findAllEnvs() {
  try {
    const posts = await prisma.environment.findMany();
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

/**
 * Fake authentication 
 * @returns A fake token
 */
function signin(name, password) {
  return Promise.resolve('an-auth-token');
}

export {
  createUser,
  createPost,
  findUserByName,
  findUserById,
  findPostById,
  findAllPosts,
  findEnvById,
  findAllEnvs,
  signin,
};
