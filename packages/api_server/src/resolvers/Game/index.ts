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

function toApiType(game: PrismaGame): Partial<Game> {
  return {
    id: game.id,
    /* .players is populated by the resolver */
    /* .identities is populated by the resolver */
    dateCreated: game.dateCreated,
    dateStarted: game.dateStarted,
    dateEnded: game.dateEnded,
  }
}

const GameResolvers: Resolvers = {
  Mutation: {
    // @ts-ignore
    async createGame(_0, _1, { dataSources }) {
      const game = await dataSources.Game.createGame();
      return { game: toApiType(game) }
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

      return { game: toApiType(game) };
    },
  },

  Game: {
    players(parent, _1, { dataSources }) {
      return [];
    },

    identities(parent, _1, { dataSources }) {
      return [];
    },
  },

  Viewer: {
    currentGame(parent, _0, { dataSources }) {
      // TODO
      return {
        id: '100',
        players: [],
        dateCreated: new Date(),
      }
    }
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
