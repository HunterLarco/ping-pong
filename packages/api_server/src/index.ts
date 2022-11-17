import schema from '@/schema';

/// HTTP Server

import express from 'express';

const app = express();
const httpServer = http.createServer(app);

/// WebSocket Server

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const wsServerCleanup = useServer({ schema }, wsServer);

/// GraphQL Server

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const graphQlServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

/// Start the Server

import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { createContext } from '@/context.js';
import { expressMiddleware } from '@apollo/server/express4';

async function main() {
  await graphQlServer.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(graphQlServer, {
      async context() {
        return createContext();
      }
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, () => resolve()));
  console.log(`🚀 Server listening at: localhost:4000`);
}

main();
