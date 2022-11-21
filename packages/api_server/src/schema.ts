import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import * as graphqlScalars from 'graphql-scalars';

import IdentityCardResolvers from '@/resolvers/IdentityCard';
import GameResolvers from '@/resolvers/Game';

import ApiTypeDefs from '@generated/schema/ast';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs, ...graphqlScalars.typeDefs],
  resolvers: mergeResolvers([
    IdentityCardResolvers,
    GameResolvers,
    graphqlScalars.resolvers,
  ]),
});
