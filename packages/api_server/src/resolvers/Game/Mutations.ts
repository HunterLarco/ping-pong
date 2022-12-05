import { GraphQLError } from 'graphql';

import { IdentityType } from '@prisma/client';
import {
  MutationResolvers,
  GameEventType,
} from '@generated/graphql/game_service/resolvers';

export const resolvers: MutationResolvers = {
  async createGame(_0, _1, { dataSources }) {
    const game = await dataSources.Game.createGame();
    const authToken = await dataSources.AuthToken.createGameHostAuthToken(
      game.id
    );
    return { game, authToken: authToken.id };
  },

  async joinGame(_0, { request }, { actor, dataSources }) {
    if (!actor) {
      throw new GraphQLError('joinGame endpoint requires a logged in user.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const { newPlayers } = await dataSources.Game.addPlayers({
      gameId: request.gameId,
      userIds: [actor.id],
    });

    for (const player of newPlayers) {
      dataSources.GameEvent.publish(request.gameId, {
        type: GameEventType.PlayerJoin,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerJoinEvent',
          player,
        },
      });
    }
  },

  async startGame(_0, { request }, { dataSources }) {
    const game = await dataSources.Game.startGame({
      gameId: request.gameId,
    });

    dataSources.GameEvent.publish(request.gameId, {
      type: GameEventType.GameStart,
      timestamp: new Date(),
      details: {
        __typename: 'GameStartEvent',
        game,
      },
    });

    return { game };
  },

  async unveil(_0, { gameId }, { actor, dataSources }) {
    if (!actor) {
      throw new GraphQLError('unveil endpoint requires a logged in user.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const { player } = await dataSources.Game.unveil({
      gameId,
      userId: actor.id,
    });

    dataSources.GameEvent.publish(gameId, {
      type: GameEventType.PlayerUpdate,
      timestamp: new Date(),
      details: {
        __typename: 'PlayerUpdateEvent',
        player,
      },
    });
  },

  async concede(_0, { gameId }, { actor, dataSources }) {
    if (!actor) {
      throw new GraphQLError('concede endpoint requires a logged in user.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const { game, modifiedPlayers } = await dataSources.Game.concede({
      gameId,
      userId: actor.id,
    });

    for (const player of modifiedPlayers) {
      dataSources.GameEvent.publish(gameId, {
        type: GameEventType.PlayerUpdate,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerUpdateEvent',
          player,
        },
      });
    }

    if (game.dateEnded) {
      dataSources.GameEvent.publish(gameId, {
        type: GameEventType.GameEnd,
        timestamp: new Date(),
        details: {
          __typename: 'GameEndEvent',
          game,
        },
      });
    }
  },
};
