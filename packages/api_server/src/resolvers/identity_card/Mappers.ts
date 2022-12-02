import { IdentityType as PrismaIdentityType } from '@prisma/client';
import {
  Resolvers,
  IdentityType,
} from '@generated/graphql/identity_card_service/resolvers';

export const resolvers: Resolvers = {
  IdentityCard: {
    id(parent) {
      return parent.id;
    },
    name(parent) {
      return parent.name;
    },
    type(parent) {
      switch (parent.type) {
        case PrismaIdentityType.Leader:
          return IdentityType.Leader;
        case PrismaIdentityType.Guardian:
          return IdentityType.Guardian;
        case PrismaIdentityType.Assassin:
          return IdentityType.Assassin;
        case PrismaIdentityType.Traitor:
          return IdentityType.Traitor;
      }
    },
    image(parent) {
      return encodeURI(
        `https://mtgtreachery.net/images/cards/en/trd/` +
          `${parent.type} - ${parent.name}.jpg`
      );
    },
    text(parent) {
      return parent.text;
    },
    rulings(parent) {
      return parent.rulings;
    },
    source(parent) {
      return parent.source;
    },
  },
};
