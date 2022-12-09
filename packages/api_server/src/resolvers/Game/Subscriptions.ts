import {
  GameEventType,
  ResolversTypes,
  SubscriptionResolvers,
} from '@generated/graphql/game_service/resolvers';
import { GraphQLError } from 'graphql';

export const resolvers: SubscriptionResolvers = {
  spectate: {
    async *subscribe(_0, { request }, { dataSources }) {
      const game = await dataSources.Game.getById(request.gameId);

      if (!game) {
        throw new GraphQLError(`Game ${request.gameId} not found.`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      yield {
        spectate: <ResolversTypes['GameEvent']>{
          type: GameEventType.Connect,
          timestamp: new Date(),
          details: {
            __typename: 'ConnectEvent',
            game,
          },
        },
      };

      for await (const event of dataSources.GameEvent.subscribe(
        request.gameId
      )) {
        yield { spectate: event };

        if (event.type == GameEventType.GameEnd) {
          break;
        }
      }
    },
  },
};
