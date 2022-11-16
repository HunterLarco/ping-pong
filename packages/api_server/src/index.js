import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book/index.js';
import LibraryResolvers from '@/resolvers/Library/index.js';

import BookSchema from '@/schema/BookService.graphql';
import LibrarySchema from '@/schema/LibraryService.graphql';

import BooksDataSource from '@/data_sources/BooksDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: [BookSchema, LibrarySchema],
  resolvers: mergeResolvers([LibraryResolvers, BookResolvers]),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
