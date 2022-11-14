import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import FuzzySearch from 'fuzzy-search';

import schema from './schema.graphql';

const libraries = [
  { branch: 'ABRHS' },
  { branch: 'NYPL' },
];

const books = [
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

const kIndex = new FuzzySearch(books, ['title', 'author']);

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: (_, args) => {
      if (!args.title && !args.author) {
        return books;
      }

      const byTitle = args.title ? kIndex.search(args.title) : [];
      const byAuthor = args.author ? kIndex.search(args.author) : [];
      return [...new Set([...byTitle, ...byAuthor])];
    },

    libraries: () => libraries,
  },

  Library: {
    books: (parent) => {
      return books.filter((book) => book.branch == parent.branch);
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
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
})();
