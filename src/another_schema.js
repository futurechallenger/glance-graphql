import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
  graphqlSync,
  GraphQLInputObjectType,
} from 'graphql';
import {
  createEnv,
  createPost,
  createUser,
  findAllEnvs,
  findAllPosts,
  findEnvById,
  findPostById,
  findUserById,
  findUserByName,
  signIn,
} from './db.js';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    userId: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: { type: new GraphQLList(PostType) },
  }),
});

const StarshipType = new GraphQLObjectType({
  name: 'StarshipType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    length: {
      type: GraphQLFloat,
      args: {
        unit: {
          type: GraphQLString,
        },
      },
      resolve(parent, args) {
        const { unit } = args;
        const { length } = parent;

        console.log('>starship> ', { parent, args });
        if (unit === 'METER') {
          return length / 100;
        }
        return length;
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    postId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: UserType,
      async resolve(parent, args, context) {
        const { authorId } = parent;
        const {
          dataloaders: { authorLoader },
        } = context;

        // let token = '';
        // const {auth} = context;
        // if (auth) {
        //   token = await auth();
        // }

        // if (!token) {
        //   throw new Error('Not authenticated!');
        // }

        // return findUserById(authorId);
        return authorLoader.load(authorId);  
      },
    },
    favours: { type: new GraphQLList(UserType) },
    env: { type: new GraphQLNonNull(EnvironmentType) },
  }),
});

const EnvironmentType = new GraphQLObjectType({
  name: 'EnvironmentType',
  fields: () => ({
    envId: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

const EnvironmentInputType = new GraphQLInputObjectType({
  name: 'EnvironmentInputType',
  fields: () => ({
    name: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

const AuthType = new GraphQLObjectType({
  name: 'AuthType',
  fields: () => ({
    token: { type: GraphQLString },
    user: {
      type: UserType,
      resolve() {
        // console.log('>params', arguments);
        return [];
      },
    },
  }),
});

/**
 * If there're no resolvers for the field in root query, it wont work.
 * And there will be errors in graphiQL.
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    starship: {
      type: StarshipType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return { id: 1, name: 'Jedi', length: 10 };
      },
    },
    user: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        return findUserById(args.userId);
      },
    },
    post: {
      type: PostType,
      args: {
        postId: { type: GraphQLID },
      },
      async resolve(parent, args) {
        return findPostById(args.postId);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return findUserByName(args.name ?? '');
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve() {
        return findAllPosts();
      },
    },
    env: {
      type: EnvironmentType,
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return findEnvById(args.name);
      },
    },
    envs: {
      type: new GraphQLList(EnvironmentType),
      async resolve() {
        return findAllEnvs();
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const newUser = await createUser({
          name: args.name,
          email: args.email,
        });
        return newUser;
      },
    },
    createPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        const newPost = await createPost({
          authorId: args.authorId,
          title: args.title,
          content: args.content,
        });

        return newPost;
      },
    },
    createEnv: {
      type: EnvironmentType,
      args: {
        envInput: { type: new GraphQLNonNull(EnvironmentInputType) },
      },
      async resolve(_, args, context) {
        const { envInput } = args;
        console.log('>Create ENV: ', args);
        return createEnv({ ...(envInput ?? {}) });
      },
    },
    signIn: {
      type: AuthType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context, info) {
        // If username / password are OK, return auth formation (the token).

        const { name, password } = args;
        const newUser = await signIn(name, password);
        return newUser;
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});