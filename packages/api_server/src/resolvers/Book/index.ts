import { PubSub } from 'graphql-subscriptions';
import { Resolvers } from '@generated/schema/resolvers';

const pubsub = new PubSub();

const BookResolvers: Resolvers = {
  Query: {
    async books(_, args, { dataSources }) {
      return await dataSources.Books.fuzzySearch({
        title: args.title,
        author: args.author,
      });
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

  Mutation: {
    async addBook(_, { title, author, branch }, { dataSources }) {
      const book = await dataSources.Books.insert({
        title,
        author,
        branch,
      });

      pubsub.publish('bookAdded', { book });

      return {
        code: 'OK',
        success: true,
        message: 'Added book.',
        book,
      };
    },
  },

  Subscription: {
    bookAdded: {
      async* subscribe() {
        // @ts-ignore
        for await (const { book } of pubsub.asyncIterator(['bookAdded'])) {
          yield { bookAdded: book }
        }
      },
    },
  },
};

export default BookResolvers;
