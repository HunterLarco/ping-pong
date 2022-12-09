import ApiTypeDefs from '@generated/graphql/ast';
import { mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as graphqlScalars from 'graphql-scalars';

import DebugResolvers from '@/resolvers/debug';
import GameResolvers from '@/resolvers/game';
import IdentityCardResolvers from '@/resolvers/identity_card';
import UserResolvers from '@/resolvers/user';
import VerificationResolvers from '@/resolvers/verification';

export default makeExecutableSchema({
  typeDefs: [ApiTypeDefs, ...graphqlScalars.typeDefs],
  resolvers: mergeResolvers([
    DebugResolvers,
    GameResolvers,
    IdentityCardResolvers,
    UserResolvers,
    VerificationResolvers,
    graphqlScalars.resolvers,
  ]),
});
