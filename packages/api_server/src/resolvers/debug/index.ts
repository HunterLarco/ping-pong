import { Resolvers } from '@generated/graphql/debug_service/resolvers';

import { resolvers as mutationResolvers } from '@/resolvers/debug/Mutations';

const resolvers: Resolvers = {
  Mutation: mutationResolvers,
};

export default resolvers;
