import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  graphqlSync,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import {
  createPost,
  createUser,
  findAllEnvs,
  findAllPosts,
  findEnvById,
  findPostById,
  findUserById,
  findUserByName,
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

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    postId: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {  type: UserType,},
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

const AuthType = new GraphQLObjectType({
  name: 'AuthType',
  fields: () => ({
    token: { type: GraphQLString },
    user: {
      type: UserType,
      resolve() {
        console.log('>params', arguments);
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
    user: {
      type: UserType,
      args: {
        userId: { type: GraphQLID },
      },
      async resolve(parent, args) {
        return findUserById(args.userId);
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
  }),
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
