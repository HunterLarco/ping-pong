import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book';

import ApiTypeDefs from '@generated/schema/api.graphql';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs],
  resolvers: mergeResolvers([BookResolvers]),
});
