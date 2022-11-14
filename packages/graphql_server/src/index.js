import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import FuzzySearch from 'fuzzy-search';
import DataLoader from 'dataloader';

import schema from './schema.graphql';

const libraries = [{ branch: 'ABRHS' }, { branch: 'NYPL' }];

class BooksDataSource {
  constructor() {
    this.books_ = [
      {
        title: 'The Awakening',
        author: 'Kate Chopin',
        branch: 'ABRHS',
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster',
        branch: 'NYPL',
      },
    ];

    this.index_ = new FuzzySearch(this.books_, ['title', 'author', 'branch']);
  }

  batchQuery = new DataLoader(async (terms) => {
    return terms.map((term) => this.index_.search(term));
  });

  async queryByBranch(name) {
    return this.books_.filter((book) => book.branch == name);
  }

  async query(term) {
    return this.batchQuery.load(term);
  }

  async all() {
    return this.books_;
  }
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    async books(_, args, { dataSources }) {
      if (!args.title && !args.author) {
        return await dataSources.Books.all();
      }

      const byTitle = args.title
        ? await dataSources.Books.query(args.title)
        : [];
      const byAuthor = args.author
        ? await dataSources.Books.query(args.author)
        : [];
      return [...new Set([...byTitle, ...byAuthor])];
    },

    libraries: () => libraries,
  },

  Library: {
    async books(parent, _, { dataSources }) {
      return await dataSources.Books.queryByBranch(parent.branch);
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

(async () => {
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
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
