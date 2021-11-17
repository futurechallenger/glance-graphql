import {
  GraphQLString, 
  GraphQLObjectType,
  GraphQLID, 
  GraphQLList, 
  GraphQLSchema,
} from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    userId: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    posts: {type: new GraphQLList(PostType)}
  }),
});

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () =>({
    postId: {type: GraphQLID,},
    content: {type: GraphQLString,},
    postedBy: {
      type: UserType, 
      resolve: async function () {
        return [];
      }
    },
    commentedBy: {
      type: new GraphQLList(UserType), 
      resolve: function() {
        return [];
      }
    }
  })
});

const EnvironmentType = new GraphQLObjectType({
  name: 'EnvironmentType',
  fields: () => ({
    envId: {type: GraphQLID},
    name: {type: GraphQLString},
    url: {type: GraphQLString},
  })
});

const AuthType = new GraphQLObjectType({
  name: 'AuthType',
  fields: () => ({
    token: {type: GraphQLString},
    user: {type: UserType, resolve(){
      console.log('>params', arguments);
      return [];
    }},
  })
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
        userId: {type: GraphQLID},
      },
      resolve(parent, args) {
        console.log('>args', {parent, args}); 
        return {
          userId: 1,
          name: 'someone new1',
          email: 'someone.new1@test.com',
          posts: null,
        }
      }
    },
    post: {
      type: PostType, 
      args: {
        postId: {type: GraphQLID},
      },
      resolve(parent, args) {
        return {
          postId: 1,
          userId: 1,
          name: 'someone new1',
          email: 'someone.new1@test.com',
          posts: null,
        };
      }

    },
    users: {
      type: new GraphQLList(UserType), 
      async resolve() {
        // return [
        //   {
        //     userId: 1,
        //     name: 'someone new1',
        //     email: 'someone.new1@test.com',
        //     posts: null,
        //   }
        // ]
        
      }
    },
    posts: {
      type: new GraphQLList(PostType), 
      resolve() {
        return [
          {
            userId: 1,
            name: 'someone new1',
            email: 'someone.new1@test.com',
            posts: null,
          }
        ];
      }
    },
    env: {
      type: EnvironmentType,
      args: {
        name: {type: GraphQLString},
      },
      resolve(parent, args) {
        return {
          name: 'env1',
          url: 'https://the-path-of-env',
        };
      }
    },
    envs: {type: new GraphQLList(EnvironmentType), resolve() {return []}},
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  fields: () => ({

  })
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
