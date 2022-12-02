import { IdentityCard } from '@prisma/client';
import { Resolvers } from '@generated/graphql/game_service/resolvers';

export const resolvers: Resolvers = {
  Game: {
    id(parent) {
      return parent.id;
    },

    async players(parent, _1, { actor, dataSources }) {
      return await Promise.all(
        parent.players.map((player) => ({
          user: dataSources.User.getByIdOrThrow(player.userId),
          identity:
            player.userId == actor?.id || player.unveiled
              ? player.identityCard
              : null,
        }))
      );
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
