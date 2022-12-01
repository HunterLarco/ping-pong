import { Resolvers } from '@generated/graphql/verification_service/resolvers';

import { resolvers as mutationResolvers } from '@/resolvers/verification/Mutations';

const resolvers: Resolvers = {
  Mutation: mutationResolvers,
};

export default resolvers;
