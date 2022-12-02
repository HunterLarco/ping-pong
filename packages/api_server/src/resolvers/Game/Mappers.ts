import { IdentityCard } from '@prisma/client';
import { Resolvers } from '@generated/graphql/game_service/resolvers';

export const resolvers: Resolvers = {
  Game: {
    id(parent) {
      return parent.id;
    },

    async players(parent, _1, { dataSources }) {
      const users = await Promise.all(
        parent.playerIds.map((playerId) =>
          dataSources.User.getByIdOrThrow(playerId)
        )
      );

      const identityAssignments = new Map<string, IdentityCard>();
      for (const { playerId, identityCard } of parent.identityAssignments) {
        identityAssignments.set(playerId, identityCard);
      }

      return users.map((user) => {
        const identity = identityAssignments.get(user.id);
        return {
          user,
          identity: identity || null,
        };
      });
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
