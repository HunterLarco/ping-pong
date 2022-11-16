import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book/index.js';
import LibraryResolvers from '@/resolvers/Library/index.js';

import BookSchema from '@/schema/BookService.graphql';
import LibrarySchema from '@/schema/LibraryService.graphql';

import BooksDataSource from '@/data_sources/BooksDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs: [BookSchema, LibrarySchema],
  resolvers: mergeResolvers([LibraryResolvers, BookResolvers]),
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: () => ({
        dataSources: {
          Books: new BooksDataSource(),
          Libraries: new LibrariesDataSource(),
        },
      }),
    })
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server listening at: localhost:4000`);
})();
