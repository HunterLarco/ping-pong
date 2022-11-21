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
      const game = await dataSources.Prisma.createGame();
      return game;
    },

    async joinGame(_0, { request }, { dataSources }) {
      const user = await dataSources.Prisma.createTemporaryUser({
        name: request.name,
      });

      await dataSources.Prisma.joinGame({
        gameId: request.gameId,
        temporaryUserId: user.id,
      });

      const gameStateEvent: GameStateEvent = {
        type: GameStateEventType.PlayerJoin,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerJoinEvent',
          name: request.name,
        },
      };

      pubsub.publish('gameState', {
        event: gameStateEvent,
      });

      return user;
    },
  },

  Subscription: {
    gameState: {
      async *subscribe(_0, { request }, { dataSources }) {
        // @ts-expect-error TS2504
        for await (const { event } of pubsub.asyncIterator(['gameState'])) {
          yield { gameState: event };
        }
      },
    },
  },
};

export default GameResolvers;
