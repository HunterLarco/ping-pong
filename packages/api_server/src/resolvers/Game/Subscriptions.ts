import { PubSub } from 'graphql-subscriptions';

import {
  SubscriptionResolvers,
  GameEvent,
} from '@generated/graphql/game_service/resolvers';

const pubsub = new PubSub();

export const resolvers: SubscriptionResolvers = {
  gameEvent: {
    async *subscribe(_0, { request }, { actor, dataSources }) {
      if (!actor) {
        throw new Error('Unauthorized');
      }

      const game = await dataSources.Game.getById(request.gameId);
      if (!game) {
        throw new Error(`Game ${request.gameId} not found.`);
      }

      if (!new Set(game.playerIds).has(actor.id)) {
        throw new Error('Unauthorized');
      }

      // @ts-expect-error TS2504
      for await (const { event } of pubsub.asyncIterator([
        `gameEvent:${request.gameId}`,
      ])) {
        yield { gameEvent: event };
      }
    },
  },
};

export function broadcastGameEvent(gameId: string, event: GameEvent) {
  pubsub.publish(`gameEvent:${gameId}`, { event });
}
