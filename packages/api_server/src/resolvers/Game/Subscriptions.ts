import { PubSub } from 'graphql-subscriptions';

import {
  SubscriptionResolvers,
  GameEvent,
} from '@generated/graphql/game_service/resolvers';

const pubsub = new PubSub();

export const resolvers: SubscriptionResolvers = {
  gameEvent: {
    async *subscribe(_0, { request }, { hostedGame, dataSources }) {
      if (!hostedGame || hostedGame.id != request.gameId) {
        throw new Error('Unauthorized');
      }

      // @ts-expect-error TS2504
      for await (const { event } of pubsub.asyncIterator([
        `gameEvent:${hostedGame.id}`,
      ])) {
        yield { gameEvent: event };
      }
    },
  },
};

export function broadcastGameEvent(gameId: string, event: GameEvent) {
  pubsub.publish(`gameEvent:${gameId}`, { event });
}
