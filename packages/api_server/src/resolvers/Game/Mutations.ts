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

    if (newPlayers) {
      dataSources.GameEvent.publish(request.gameId, {
        type: GameEventType.PlayerJoin,
        timestamp: new Date(),
        details: {
          __typename: 'PlayerJoinEvent',
          user: actor,
        },
      });
    }
  },

  async startGame(_0, { request }, { dataSources }) {
    const game = await dataSources.Game.startGame({
      gameId: request.gameId,
      identityDataSource: dataSources.MTGTreachery,
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

  async unveil(_0, { game }, { actor, dataSources }) {
    if (!actor) {
      throw new GraphQLError('unveil endpoint requires a logged in user.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const player = await dataSources.Game.unveil({
      gameId: game,
      userId: actor.id,
    });

    if (!player) {
      throw new GraphQLError(
        `User ${actor.id} is not a player in game ${game}.`,
        { extensions: { code: 'FORBIDDEN' } }
      );
    }

    dataSources.GameEvent.publish(game, {
      type: GameEventType.PlayerUnveil,
      timestamp: new Date(),
      details: {
        __typename: 'PlayerUnveilEvent',
        player,
      },
    });
  },

  async concede(_0, { game }, { actor, dataSources }) {
    if (!actor) {
      throw new GraphQLError('concede endpoint requires a logged in user.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const player = await dataSources.Game.concede({
      gameId: game,
      userId: actor.id,
    });

    if (!player) {
      throw new GraphQLError(
        `User ${actor.id} is not a player in game ${game}.`,
        { extensions: { code: 'FORBIDDEN' } }
      );
    }

    dataSources.GameEvent.publish(game, {
      type: GameEventType.PlayerConcede,
      timestamp: new Date(),
      details: {
        __typename: 'PlayerConcedeEvent',
        player,
      },
    });
  },
};
