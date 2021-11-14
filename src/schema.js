import { buildSchema } from 'graphql';

/**
 * 1. Input in mutation, must define a input type like `EnvInput`, 
 * directly use an existing type will not work
 * 2. Query fields need resolver, no fields resolvers wont work. There are fields, no resolvers wont work too
 */
const schema = buildSchema(`
type Query {
  user: User
  post: Post
  users: [User]
  posts: [Post]
  envs: [Environment]
}

type Mutation {
  login(email: String, password: String!): Auth
  post(env: EnvInput! , content: String!, title: String!): Post!
}

type Environment {
  envId: ID!
  name: String!
  url: String!
}

input EnvInput {
  envId: ID!
  name: String!
  url: String!
}

type User {
  userId: ID!
  name: String!
  email: String!
  posts: [Post]
}

type Post {
  postId: ID!
  content: String
  postedBy: User
  commentedBy: [User]
}

type Auth {
  token: String!
  user: User
}
`);

export { schema };
