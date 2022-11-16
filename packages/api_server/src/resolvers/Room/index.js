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
    },
  },

  Subscription: {
    joinRoom: {
      subscribe: () => ({
        async *[Symbol.asyncIterator]() {
          yield {
            joinRoom: {
              type: 'Connected',
              timestamp: new Date(),
              details: {
                __typename: 'ConnectedEvent',
                cursor: 'foobar',
              },
            },
          };
        },
      }),
    },
  },
};
