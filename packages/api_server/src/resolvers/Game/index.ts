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
      const user = await dataSources.TemporaryUser.createTemporaryUser({
        name: request.name,
      });

      const authToken =
        await dataSources.AuthToken.createTemporaryUserAuthToken(user.id);

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

      return { user, authToken: authToken.id };
    },
  },

  Subscription: {
    gameState: {
      async *subscribe(_0, { request }, { actor, dataSources }) {
        if (!actor) {
          throw new Error('Unauthorized');
        }

        // @ts-expect-error TS2504
        for await (const { event } of pubsub.asyncIterator(['gameState'])) {
          yield { gameState: event };
        }
      },
    },
  },
};

export default GameResolvers;
