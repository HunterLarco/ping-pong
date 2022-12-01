import { Resolvers } from '@generated/graphql/game_service/resolvers';

export const resolvers: Resolvers = {
  Game: {
    id(parent) {
      return parent.id;
    },
    async players(parent, _1, { dataSources }) {
      return await Promise.all(
        parent.playerIds.map((playerId) =>
          dataSources.User.getByIdOrThrow(playerId)
        )
      );
    },
    identities(parent, _1, { dataSources }) {
      return [];
    },
    dateCreated(parent) {
      return parent.dateCreated;
    },
    dateStarted(parent) {
      return parent.dateStarted;
    },
    dateEnded(parent) {
      return parent.dateEnded;
    },
  },

  Viewer: {
    currentGame(parent, _0, { dataSources, actor }) {
      if (!actor) {
        return null;
      }

      return dataSources.Game.getCurrentGame({ playerId: actor.id });
    },
  },
};
