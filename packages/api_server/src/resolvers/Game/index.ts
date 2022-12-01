import { Resolvers } from '@generated/graphql/game_service/resolvers';

import { resolvers as mutationResolvers } from '@/resolvers/game/Mutations';
import { resolvers as subscriptionResolvers } from '@/resolvers/game/Subscriptions';
import { resolvers as mappers } from '@/resolvers/game/Mappers';

const resolvers: Resolvers = {
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers,
  ...mappers,
};

export default resolvers;
