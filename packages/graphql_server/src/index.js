import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema.graphql';
import BooksDataSource from './data_sources/BooksDataSource.js';

const libraries = [{ branch: 'ABRHS' }, { branch: 'NYPL' }];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    async books(_, args, { dataSources }) {
      return await dataSources.Books.fuzzySearch({
        title: args.title,
        author: args.author,
      });
    },

    libraries: () => libraries,
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
      },
    }),
  });

  console.log(`🚀 Server listening at: ${url}`);
})();
