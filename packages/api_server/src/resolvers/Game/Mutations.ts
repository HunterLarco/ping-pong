import { IdentityType } from '@prisma/client';

import {
  MutationResolvers,
  GameEventType,
} from '@generated/graphql/game_service/resolvers';

import { broadcastGameEvent } from '@/resolvers/game/Subscriptions';

export const resolvers: MutationResolvers = {
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

    broadcastGameEvent(request.gameId, {
      type: GameEventType.PlayerJoin,
      timestamp: new Date(),
      details: {
        __typename: 'PlayerJoinEvent',
        user: {
          id: actor.id,
        },
      },
    });
  },

  async startGame(_0, { request }, { dataSources }) {
    const game = await dataSources.Game.startGame({
      gameId: request.gameId,
      identityDataSource: dataSources.MTGTreachery,
    });

    let leader;
    for (const { playerId, identityCard } of game.identityAssignments) {
      if (identityCard.type == IdentityType.Leader) {
        leader = await dataSources.User.getByIdOrThrow(playerId);
      }
    }
    if (!leader) {
      throw new Error(`Game ${game.id} does not have a leader.`);
    }

    broadcastGameEvent(request.gameId, {
      type: GameEventType.GameStart,
      timestamp: new Date(),
      details: {
        __typename: 'GameStartEvent',
        leader,
      },
    });

    return { game };
  },
};
