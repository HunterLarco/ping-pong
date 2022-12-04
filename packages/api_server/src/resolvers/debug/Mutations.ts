import Chance from 'chance';
import { GraphQLError } from 'graphql';

import { MutationResolvers } from '@generated/graphql/debug_service/resolvers';

export const resolvers: MutationResolvers = {
  async populateGame(_0, { request }, { dataSources }) {
    {
      const game = await dataSources.Game.getById(request.gameId);
      if (!game) {
        throw new GraphQLError(`Game ${request.gameId} not found.`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
    }

    const chance = new Chance();
    const range = (n: Number) => Array.from(Array(n).keys());
    const users = await Promise.all(
      range(request.numberOfPlayers).map(async () => {
        const user = await dataSources.User.createUser({
          phoneNumber: chance.phone({ formatted: false }),
          name: chance.first(),
        });

        const authToken = await dataSources.AuthToken.createUserAuthToken(
          user.id
        );

        return {
          user,
          authToken: authToken.id,
        };
      })
    );

    const { game } = await dataSources.Game.addPlayers({
      gameId: request.gameId,
      userIds: users.map(({ user }) => user.id),
    });

    return {
      game,
      users,
    };
  },
};
