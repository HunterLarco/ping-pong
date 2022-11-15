import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book/index.js';
import LibraryResolvers from '@/resolvers/Library/index.js';

import schema from '@/schema/api.graphql';

import BooksDataSource from '@/data_sources/BooksDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: mergeResolvers([LibraryResolvers, BookResolvers]),
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: () => ({
      dataSources: {
        Books: new BooksDataSource(),
        Libraries: new LibrariesDataSource(),
      },
    }),
  });

  console.log(`🚀 Server listening at: ${url}`);
})();
