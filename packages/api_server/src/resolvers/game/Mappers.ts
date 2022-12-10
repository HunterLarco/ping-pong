import {
  PlayerState,
  Resolvers,
} from '@generated/graphql/game_service/resolvers';
import { IdentityCard, PlayerState as ModelPlayerState } from '@prisma/client';

export const resolvers: Resolvers = {
  Game: {
    id(parent) {
      return parent.id;
    },
    players(parent) {
      return parent.players;
    },
    viewerIsParticipant(parent, _1, { actor }) {
      return !!parent.players.find((player) => player.userId == actor?.id);
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

    unveiled(parent) {
      return parent.unveiled;
    },

    state(parent) {
      switch (parent.state) {
        case ModelPlayerState.Active:
          return PlayerState.Active;
        case ModelPlayerState.Inactive:
          return PlayerState.Inactive;
        case ModelPlayerState.Lost:
          return PlayerState.Lost;
        case ModelPlayerState.Won:
          return PlayerState.Won;
      }
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
