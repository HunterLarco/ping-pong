import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import * as graphqlScalars from 'graphql-scalars';

import GameResolvers from '@/resolvers/game';
import IdentityCardResolvers from '@/resolvers/identity_card';
import UserResolvers from '@/resolvers/user';
import VerificationResolvers from '@/resolvers/verification';

import ApiTypeDefs from '@generated/graphql/ast';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs, ...graphqlScalars.typeDefs],
  resolvers: mergeResolvers([
    GameResolvers,
    IdentityCardResolvers,
    UserResolvers,
    VerificationResolvers,
    graphqlScalars.resolvers,
  ]),
});
