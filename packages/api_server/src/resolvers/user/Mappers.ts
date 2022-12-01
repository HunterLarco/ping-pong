import { Resolvers } from '@generated/graphql/user_service/resolvers';

export const resolvers: Resolvers = {
  Viewer: {
    id(parent) {
      return parent.id;
    },
    name(parent) {
      return parent.name;
    },
  },
};
