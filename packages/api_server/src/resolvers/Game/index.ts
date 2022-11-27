import { PubSub } from 'graphql-subscriptions';
import type { IdentityAssignment } from '@prisma/client';
import { IdentityType } from '@prisma/client';

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
          user: {
            id: actor.id,
            name: actor.name,
          },
        },
      };

      pubsub.publish(`gameState:${request.gameId}`, {
        event: gameStateEvent,
      });
    },

    async startGame(_0, { request }, { dataSources }) {
      const game = await dataSources.Game.startGame({
        gameId: request.gameId,
        identityDataSource: dataSources.MTGTreachery,
      });

      const leaderAssignment = game.identityAssignments.find(
        (assignment) => assignment.identityCard.type == IdentityType.Leader
      );
      if (!leaderAssignment) {
        throw new Error(`Game ${game.id} does not have a leader.`);
      }

      const users = await Promise.all(
        game.identityAssignments.map(({ playerId }) =>
          dataSources.User.getByIdOrThrow(playerId)
        )
      );

      const leader = users.find(({ id }) => id == leaderAssignment.playerId);
      if (!leader) {
        throw new Error('asd');
      }
      const everyoneElse = users.filter(({ id }) => id != leader.id);

      return {
        leader: {
          id: leader.id,
          name: leader.name,
        },
        everyoneElse: everyoneElse.map((user) => ({
          id: user.id,
          name: user.name,
        })),
      };
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
