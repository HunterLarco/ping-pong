import { Resolvers } from '@generated/schema/resolvers';

const GameResolvers: Resolvers = {
  Mutation: {
    async createGame({}, {}, { dataSources }) {
      return {
        id: 'asd',
        dateCreated: new Date(),
      };
    },
  },
};

export default GameResolvers;
