import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';

import { createGlobalContext } from '@/GlobalContext';
import { createRequestContext } from '@/RequestContext';
import schema from '@/schema';

async function main() {
  const globalContext = await createGlobalContext();

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
        return createRequestContext({
          globalContext,
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
      async context({ req }) {
        return createRequestContext({
          globalContext,
          authorization: req.get('Authorization') || null,
        });
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, () => resolve())
  );
  console.log(`🚀 Server listening at: localhost:4000`);
  console.log(`🚀 Running in ${process.env.NODE_ENV} mode`);
}

main();
