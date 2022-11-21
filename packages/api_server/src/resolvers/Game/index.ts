import { Resolvers } from '@generated/graphql/resolvers';

const GameResolvers: Resolvers = {
  Mutation: {
    async createGame(_0, _1, { dataSources }) {
      const game = await dataSources.Prisma.createGame();
      return game;
    },

    async joinGame(_0, { request }, { dataSources }) {
      const user = await dataSources.Prisma.createTemporaryUser({
        name: request.name,
      });

      await dataSources.Prisma.joinGame({
        gameId: request.gameId,
        temporaryUserId: user.id,
      });

      return user;
    },
  },
};

export default GameResolvers;
