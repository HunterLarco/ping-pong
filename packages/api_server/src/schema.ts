import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import IdentityCardResolvers from '@/resolvers/IdentityCard';

import ApiTypeDefs from '@generated/schema/api.graphql';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs],
  resolvers: mergeResolvers([IdentityCardResolvers]),
});
