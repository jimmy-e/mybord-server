import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { Prisma } from 'prisma-binding';
import { buildContext, createOnConnect } from 'graphql-passport';
import resolvers from 'schema/resolvers';
import generatedSchema from 'generated/prisma.graphql';
import schema from 'schema/schema.graphql';

// creates new apollo server
const initializeServer = (
  expressSessionMiddleware: express.RequestHandler,
  passportMiddleware: express.Handler,
  passportSessionMiddleware: express.RequestHandler,
  prisma: Prisma,
): ApolloServer => new ApolloServer({
  context: (request) => ({
    passport: buildContext({ req: request.req, res: request.res }),
    prisma,
    request,
  }),
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
  resolvers,
  subscriptions: {
    onConnect: createOnConnect([
      expressSessionMiddleware,
      passportMiddleware,
      passportSessionMiddleware,
    ]),
  },
  typeDefs: [generatedSchema, schema],
});

export default initializeServer;
