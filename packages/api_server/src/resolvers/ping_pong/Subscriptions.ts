import type { SubscriptionResolvers } from '@generated/graphql/ping_pong_service/resolvers';
import { GraphQLError } from 'graphql';

export const resolvers: SubscriptionResolvers = {
  messageHistory: {
    async *subscribe(_0, _1, { dataSources }) {
      for await (const event of dataSources.MessageLogPubSub.subscribe()) {
        yield { messageHistory: event };
      }
    },
  },
};
