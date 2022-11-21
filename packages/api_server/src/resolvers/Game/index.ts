import { Resolvers } from '@generated/graphql/resolvers';

const GameResolvers: Resolvers = {
  Mutation: {
    async createGame(_0, _1, { dataSources }) {
      const game = await dataSources.Prisma.createGame();
      return game;
    },
  },
};

export default GameResolvers;
