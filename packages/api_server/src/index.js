import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema/api.graphql';

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

  Book: {
    normalizedTitle(parent) {
      return parent.title
        .toLowerCase()
        .split(/(?<=\s|-)/)
        .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
        .join('');
    },
  },

  Library: {
    async books(parent, _, { dataSources }) {
      return await dataSources.Books.queryByBranch(parent.branch);
    },
  },

  Mutation: {
    async addBook(_, { title, author, branch }, { dataSources }) {
      const book = await dataSources.Books.insert({
        title,
        author,
        branch,
      });

      return {
        code: 'OK',
        success: true,
        message: 'Added book.',
        book,
      };
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
