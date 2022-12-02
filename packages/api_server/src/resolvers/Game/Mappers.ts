import { IdentityCard } from '@prisma/client';
import { Resolvers } from '@generated/graphql/game_service/resolvers';

export const resolvers: Resolvers = {
  Game: {
    id(parent) {
      return parent.id;
    },
    players(parent) {
      return parent.players;
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

  Player: {
    async user(parent, _1, { dataSources }) {
      return dataSources.User.getByIdOrThrow(parent.userId);
    },

    identity(parent, _1, { actor }) {
      return parent.userId == actor?.id || parent.unveiled
        ? parent.identityCard
        : null;
    },

    conceded(parent) {
      return parent.conceded;
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
