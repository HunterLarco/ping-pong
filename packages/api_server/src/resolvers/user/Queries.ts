import { QueryResolvers } from '@generated/graphql/user_service/resolvers';

export const resolvers: QueryResolvers = {
  me(_0, _1, { actor }) {
    return actor;
  },
};
