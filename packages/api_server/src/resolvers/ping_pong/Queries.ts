import type { QueryResolvers } from '@generated/graphql/ping_pong_service/resolvers';

export const resolvers: QueryResolvers = {
  async messageHistory(_0, _1, { dataSources }) {
    return await dataSources.MessageHistory.getAllHistory();
  },
};
