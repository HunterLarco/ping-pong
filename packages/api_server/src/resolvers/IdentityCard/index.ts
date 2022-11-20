import {
  Resolvers,
  IdentityCard,
  IdentityType,
} from '@generated/schema/resolvers';
import { OracleCard } from '@/data_sources/MTGTreacheryDataSource';

function toIdentityType(raw: string): IdentityType {
  switch (raw.toLowerCase()) {
    case 'leader':
      return IdentityType.Leader;
    case 'guardian':
      return IdentityType.Guardian;
    case 'assassin':
      return IdentityType.Assassin;
    case 'traitor':
      return IdentityType.Traitor;
  }
  throw `Unknown identity type '${raw}'`;
}

function toApiType(card: OracleCard): IdentityCard {
  return {
    id: card.id.toString(16),
    name: card.name,
    type: toIdentityType(card.types.subtype),
    image: encodeURI(
      `https://mtgtreachery.net/images/cards/en/trd/` +
        `${card.types.subtype} - ${card.name}.jpg`
    ),
    text: card.text.replace(/\|/g, '\n'),
    rulings: card.rulings,
    source: card.uri,
  };
}

const IdentityCardResolvers: Resolvers = {
  Query: {
    async identityCards(_, args, { dataSources }) {
      const cards = await dataSources.MTGTreachery.fetchAll();
      return cards.map((card: OracleCard) => toApiType(card));
    },
  },
};

export default IdentityCardResolvers;
