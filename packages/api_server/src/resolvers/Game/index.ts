import { PubSub } from 'graphql-subscriptions';

import {
  Resolvers,
  GameStateEvent,
  GameStateEventType,
} from '@generated/graphql/resolvers';

const pubsub = new PubSub();

const GameResolvers: Resolvers = {
  Mutation: {
    async createGame(_0, _1, { dataSources }) {
      return dataSources.Game.createGame();
    },

    async joinGame(_0, { request }, { actor, dataSources }) {
      if (!actor) {
        throw new Error('Unauthorized');
      }

      await dataSources.Game.addPlayer({
        gameId: request.gameId,
        userId: actor.id,
      });

      const gameStateEvent: GameStateEvent = {
        type: GameStateEventType.PlayerJoin,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerJoinEvent',
          name: actor.name,
        },
      };

      pubsub.publish(`gameState:${request.gameId}`, {
        event: gameStateEvent,
      });
    },
  },

  Subscription: {
    gameState: {
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
          `gameState:${request.gameId}`,
        ])) {
          yield { gameState: event };
        }
      },
    },
  },
};

export default GameResolvers;
