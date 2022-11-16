import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';

const pubsub = new PubSub();

export default {
  Query: {
    async roomEvents(_, { request }, { dataSources }) {
      return await dataSources.RoomEvents.queryBeforeDate(new Date());
    },
  },

  Mutation: {
    async sendMessage(_, { request }, { dataSources }) {
      const { text } = request.payload;
      const event = await dataSources.RoomEvents.insert({
        type: 'ChatMessage',
        timestamp: new Date(),
        details: {
          __typename: 'ChatMessageEvent',
          author: {
            id: 'foo',
            handle: 'snowflakesmasher',
          },
          payload: {
            text,
          },
        },
      });
      pubsub.publish('roomEvent', { event });
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

          for await (const { event } of pubsub.asyncIterator(['roomEvent'])) {
            yield { joinRoom: event };
          }
        },
      }),
    },
  },
};
