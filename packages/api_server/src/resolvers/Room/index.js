import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';

const pubsub = new PubSub();

export default {
  Query: {
    async roomEvents(_, { request }, { dataSources }) {
      return [];
    },
  },

  Mutation: {
    async sendMessage(_, { request }, { dataSources }) {
      throw new GraphQLError('Not Implemented');
    },
  },

  Subscription: {
    joinRoom: {
      subscribe: () => [],
    },
  },
};
