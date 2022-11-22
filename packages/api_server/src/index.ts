import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import express from 'express';

import { createContext } from '@/context';
import schema from '@/schema';

async function initiatePrismaClient() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  return prisma;
}

async function main() {
  const prismaClient = await initiatePrismaClient();

  /// HTTP Server

  const app = express();
  const httpServer = http.createServer(app);

  /// WebSocket Server

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const wsServerCleanup = useServer<Record<string, string | undefined>, {}>(
    {
      schema,
      async context({ connectionParams }) {
        return createContext({
          prismaClient,
          authorization:
            connectionParams && connectionParams.Authorization
              ? connectionParams.Authorization
              : null,
        });
      },
    },
    wsServer
  );

  /// GraphQL Server

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

  await graphQlServer.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(graphQlServer, {
      async context() {
        return createContext({ prismaClient, authorization: null });
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, () => resolve())
  );
  console.log(`🚀 Server listening at: localhost:4000`);
}

main();
