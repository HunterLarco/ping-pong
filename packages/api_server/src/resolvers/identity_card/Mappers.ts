import {
  Resolvers,
  IdentityType,
} from '@generated/graphql/identity_card_service/resolvers';

export const resolvers: Resolvers = {
  IdentityCard: {
    id(parent) {
      return parent.id.toString(16);
    },
    name(parent) {
      return parent.name;
    },
    type(parent) {
      switch (parent.types.subtype.toLowerCase()) {
        case 'leader':
          return IdentityType.Leader;
        case 'guardian':
          return IdentityType.Guardian;
        case 'assassin':
          return IdentityType.Assassin;
        case 'traitor':
          return IdentityType.Traitor;
      }
      throw new Error(`Unknown identity type '${parent.types.subtype}'`);
    },
    image(parent) {
      return encodeURI(
        `https://mtgtreachery.net/images/cards/en/trd/` +
          `${parent.types.subtype} - ${parent.name}.jpg`
      );
    },
    text(parent) {
      return parent.text.replace(/\|/g, '\n');
    },
    rulings(parent) {
      return parent.rulings;
    },
    source(parent) {
      return parent.uri;
    },
  },
};
