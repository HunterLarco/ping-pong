import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
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

      pubsub.publish('bookAdded', { bookAdded: book });

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
      subscribe: () => pubsub.asyncIterator(['bookAdded']),
    },
  },
};
