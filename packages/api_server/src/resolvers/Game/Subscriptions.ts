import { PubSub } from 'graphql-subscriptions';

import {
  SubscriptionResolvers,
  ResolversTypes,
} from '@generated/graphql/game_service/resolvers';

const pubsub = new PubSub();

export const resolvers: SubscriptionResolvers = {
  spectate: {
    async *subscribe(_0, { request }, _2) {
      // @ts-expect-error TS2504
      for await (const { event } of pubsub.asyncIterator([
        `gameEvent:${request.gameId}`,
      ])) {
        yield { spectate: event };
      }
    },
  },
};

export function broadcastGameEvent(
  gameId: string,
  event: ResolversTypes['GameEvent']
) {
  pubsub.publish(`gameEvent:${gameId}`, { event });
}
