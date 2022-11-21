import {
  Resolvers,
  IdentityCard,
  IdentityType,
  IdentityCardFilters,
} from '@generated/schema/resolvers';
import {
  FuzzySearchFilters,
  OracleCard,
} from '@/data_sources/MTGTreacheryDataSource';

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

function toDataSourceFilters(
  input: IdentityCardFilters | null | undefined
): FuzzySearchFilters {
  return {
    name: input && input.name ? input.name : null,
  };
}

const IdentityCardResolvers: Resolvers = {
  Query: {
    async identityCards({}, { filters }, { dataSources }) {
      const cards = await dataSources.MTGTreachery.fuzzySearch(
        toDataSourceFilters(filters)
      );

      return cards.map((card: OracleCard) => toApiType(card));
    },
  },
};

export default IdentityCardResolvers;
