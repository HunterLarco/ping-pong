import { Resolvers } from '@generated/graphql/game_service/resolvers';

import { resolvers as mappers } from '@/resolvers/game/Mappers';
import { resolvers as mutationResolvers } from '@/resolvers/game/Mutations';
import { resolvers as queryResolvers } from '@/resolvers/game/Queries';
import { resolvers as subscriptionResolvers } from '@/resolvers/game/Subscriptions';

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers,
  ...mappers,
};

export default resolvers;
