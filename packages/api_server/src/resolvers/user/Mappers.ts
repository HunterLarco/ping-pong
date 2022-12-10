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

  User: {
    id(parent) {
      return parent.id;
    },
    name(parent) {
      return parent.name;
    },
    isViewer(parent, _1, { actor }) {
      return parent.id == actor?.id;
    },
  },
};
