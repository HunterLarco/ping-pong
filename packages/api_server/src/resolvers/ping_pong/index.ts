import { Resolvers } from '@generated/graphql/ping_pong_service/resolvers';

import { resolvers as mappers } from '@/resolvers/ping_pong/Mappers';
import { resolvers as mutationResolvers } from '@/resolvers/ping_pong/Mutations';
import { resolvers as queryResolvers } from '@/resolvers/ping_pong/Queries';
import { resolvers as subscriptionResolvers } from '@/resolvers/ping_pong/Subscriptions';

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers,
  ...mappers,
};

export default resolvers;
