import { Resolvers } from '@generated/graphql/identity_card_service/resolvers';

import { resolvers as queryResolvers } from '@/resolvers/identity_card/Queries';

const resolvers: Resolvers = {
  Query: queryResolvers,
};

export default resolvers;
