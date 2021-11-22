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
<<<<<<< HEAD
  }
}

async function findUserById(userId) {
  console.log('findUserById: ', userId);

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
=======
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
>>>>>>> 573dcee (fix bugs)
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
    console.error('ERROR: ', e);
    throw e;
  } finally {
    prisma.$disconnect();
  }
}

async function batchFindUsers(Ids) {
  console.log('batchFindUsers: ', Ids);
  if (!Array.isArray(Ids) || Ids.length === 0) {
    return [];
  }

  try {
    const condition = {
      where: {
        id: { in: Ids },
      },
    };
    const users = await prisma.user.findMany(condition);
    prisma.$disconnect();
    return users;
  } catch (e) {
    prisma.$disconnect();
  }
}

<<<<<<< HEAD
=======
async function createEnv({ name, url }) {
  try {
    const env = await prisma.environment.create({
      data: {
        name,
        url,
      },
    });
    return env;
  } catch (e) {
    console.error('ERROR: ', e);
    throw e;
  } finally {
    prisma.$disconnect();
  }
}

>>>>>>> 573dcee (fix bugs)
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
  console.log('>findAllPosts');

  try {
    const posts = await prisma.post.findMany();
<<<<<<< HEAD
    prisma.$disconnect();
    return users;
  } catch (e) {
=======
    return posts;
  } catch (e) {
    console.error('ERROR: ', e);
    throw e;
  } finally {
>>>>>>> 573dcee (fix bugs)
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
<<<<<<< HEAD
 * Fake authentication 
=======
 * Fake authentication
>>>>>>> 573dcee (fix bugs)
 * @returns A fake token
 */
function signIn(name, password) {
  return Promise.resolve({ token: 'an-auth-token' });
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
  signIn,
<<<<<<< HEAD
=======
  createEnv,
<<<<<<< HEAD
>>>>>>> 573dcee (fix bugs)
=======
  batchFindUsers,
>>>>>>> 87997c5 (batch db requests)
};
