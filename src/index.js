import express from 'express';
import { graphqlHTTP } from 'express-graphql';
// import { schema } from './schema.js';
import { schema } from './another_schema.js';
import cors from 'cors';
import * as resolvers from './resolvers.js';

const PORT = 9090;

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    // rootValue: {
    //   ...resolvers,
    //   user: resolvers.users()?.[0],
    //   post: resolvers.posts()?.[0],
    // },
    /**
     * If graphiql is set to false, url http://localhost:xxxx/graphql will result to an error says you
     * have to provide the query. If it's true, you will see the graphic UI to test your query there
     */
    graphiql: true, // process.env.ENV === development
    context: async () => {
      const authorization = req.headers?.authorization;
      if (!authorization) {
        return;
      }

      const token = authorization.split(' ')[1];
      return token;
    },
  })),
);
app.listen(process.env.PORT ?? PORT);

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
