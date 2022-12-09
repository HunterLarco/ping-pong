import { QueryResolvers } from '@generated/graphql/game_service/resolvers';

export const resolvers: QueryResolvers = {
  async getGameById(_0, { id }, { dataSources }) {
    return dataSources.Game.getById(id);
  },
};
