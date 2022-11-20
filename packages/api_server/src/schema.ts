import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import IdentityCardResolvers from '@/resolvers/IdentityCard';

import ApiTypeDefs from '@generated/schema/api.graphql';

import { URLTypeDefinition, URLResolver } from 'graphql-scalars';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs, URLTypeDefinition],
  resolvers: mergeResolvers([IdentityCardResolvers, { URL: URLResolver }]),
});
