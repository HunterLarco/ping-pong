import { Resolvers } from '@generated/graphql/ping_pong_service/resolvers';

import { resolvers as mappers } from '@/resolvers/ping_pong/Mappers';
import { resolvers as mutationResolvers } from '@/resolvers/ping_pong/Mutations';
import { resolvers as queryResolvers } from '@/resolvers/ping_pong/Queries';

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  ...mappers,
};

export default resolvers;
