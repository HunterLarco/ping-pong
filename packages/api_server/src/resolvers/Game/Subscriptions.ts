import {
  SubscriptionResolvers,
  ResolversTypes,
} from '@generated/graphql/game_service/resolvers';

export const resolvers: SubscriptionResolvers = {
  spectate: {
    async *subscribe(_0, { request }, { dataSources }) {
      for await (const event of dataSources.GameEvent.subscribe(
        request.gameId
      )) {
        yield { spectate: event };
      }
    },
  },
};
