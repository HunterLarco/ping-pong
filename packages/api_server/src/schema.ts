import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import * as graphqlScalars from 'graphql-scalars';

import AuthResolvers from '@/resolvers/Auth';
import GameResolvers from '@/resolvers/Game';
import IdentityCardResolvers from '@/resolvers/IdentityCard';

import ApiTypeDefs from '@generated/graphql/ast';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs, ...graphqlScalars.typeDefs],
  resolvers: mergeResolvers([
    AuthResolvers,
    GameResolvers,
    IdentityCardResolvers,
    graphqlScalars.resolvers,
  ]),
});
