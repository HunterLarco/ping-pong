import { Resolvers } from '@generated/graphql/user_service/resolvers';

import { resolvers as mappers } from '@/resolvers/user/Mappers';
import { resolvers as mutationResolvers } from '@/resolvers/user/Mutations';
import { resolvers as queryResolvers } from '@/resolvers/user/Queries';

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  ...mappers,
};

export default resolvers;
