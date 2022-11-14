import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema.graphql';

import BooksDataSource from './data_sources/BooksDataSource.js';
import LibrariesDataSource from './data_sources/LibrariesDataSource.js';

const resolvers = {
  Query: {
    async books(_, args, { dataSources }) {
      return await dataSources.Books.fuzzySearch({
        title: args.title,
        author: args.author,
      });
    },

    async libraries(_, args, { dataSources }) {
      return await dataSources.Libraries.fuzzySearch({ branch: args.branch });
    },
  },

  Library: {
    async books(parent, _, { dataSources }) {
      return await dataSources.Books.queryByBranch(parent.branch);
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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
