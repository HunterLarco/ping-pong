import { Resolvers } from '@generated/graphql/identity_card_service/resolvers';

import { resolvers as queryResolvers } from '@/resolvers/identity_card/Queries';
import { resolvers as mappers } from '@/resolvers/identity_card/Mappers';

const resolvers: Resolvers = {
  Query: queryResolvers,
  ...mappers,
};

export default resolvers;
