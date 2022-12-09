import { Resolvers } from '@generated/graphql/debug_service/resolvers';
import { GraphQLError } from 'graphql';

import { resolvers as mutationResolvers } from '@/resolvers/debug/Mutations';

const resolvers: Resolvers = {
  Mutation: {
    debug() {
      if (process.env.NODE_ENV != 'development') {
        throw new GraphQLError(`Debug endpoints are disabled in production.`, {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return {};
    },
  },

  DebugMutations: mutationResolvers,
};

export default resolvers;
