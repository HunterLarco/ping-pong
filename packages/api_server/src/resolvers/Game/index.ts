import { PubSub } from 'graphql-subscriptions';
import type { IdentityAssignment } from '@prisma/client';
import { IdentityType, Game as PrismaGame } from '@prisma/client';

import {
  Resolvers,
  Game,
  GameEvent,
  GameEventType,
} from '@generated/graphql/game_service/resolvers';

const pubsub = new PubSub();

const GameResolvers: Resolvers = {
  Mutation: {
    // @ts-ignore
    async createGame(_0, _1, { dataSources }) {
      const game = await dataSources.Game.createGame();
      return { game };
    },

    async joinGame(_0, { request }, { actor, dataSources }) {
      if (!actor) {
        throw new Error('Unauthorized');
      }

      await dataSources.Game.addPlayer({
        gameId: request.gameId,
        userId: actor.id,
      });

      const gameEvent: GameEvent = {
        type: GameEventType.PlayerJoin,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerJoinEvent',
          user: {
            id: actor.id,
          },
        },
      };

      pubsub.publish(`gameEvent:${request.gameId}`, {
        event: gameEvent,
      });
    },

    // @ts-ignore
    async startGame(_0, { request }, { dataSources }) {
      const game = await dataSources.Game.startGame({
        gameId: request.gameId,
        identityDataSource: dataSources.MTGTreachery,
      });

      return { game };
    },
  },

  Game: {
    id(parent) {
      return parent.id;
    },
    players(parent, _1, { dataSources }) {
      return [];
    },
    identities(parent, _1, { dataSources }) {
      return [];
    },
    dateCreated(parent) {
      return parent.dateCreated;
    },
    dateStarted(parent) {
      return parent.dateStarted;
    },
    dateEnded(parent) {
      return parent.dateEnded;
    },
  },

  Viewer: {
    currentGame(parent, _0, { dataSources }) {
      // TODO
      return null;
    },
  },

  Subscription: {
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
  },
};

export default GameResolvers;
