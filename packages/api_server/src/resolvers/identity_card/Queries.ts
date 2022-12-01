import { QueryResolvers } from '@generated/graphql/identity_card_service/resolvers';

export const resolvers: QueryResolvers = {
  async identityCards(_0, { filters }, { dataSources }) {
    return await dataSources.MTGTreachery.fuzzySearch({
      name: filters?.name || null,
    });
  },
};
