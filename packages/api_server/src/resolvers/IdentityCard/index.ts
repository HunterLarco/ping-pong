import { Resolvers } from '@generated/schema/resolvers';

const IdentityCardResolvers: Resolvers = {
  Query: {
    async identityCards(_, args, { dataSources }) {
      return [];
    },
  },

  IdentityCard: {
    image(parent) {
      return '';
    },
  },
};

export default IdentityCardResolvers;
