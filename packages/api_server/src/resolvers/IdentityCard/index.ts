import {
  Resolvers,
  IdentityCard,
  IdentityType,
} from '@generated/schema/resolvers';
import { OracleCard } from '@/data_sources/MTGTreacheryDataSource';

function toApiType(card: OracleCard): IdentityCard {
  return {
    id: '10',
    title: card.name,
    type: IdentityType.Leader,
    image: '',
    text: '',
    rulings: [],
    source: '',
  };
}

const IdentityCardResolvers: Resolvers = {
  Query: {
    async identityCards(_, args, { dataSources }) {
      const cards = await dataSources.MTGTreachery.fetchAll();
      return cards.map((card: OracleCard) => toApiType(card));
    },
  },

  IdentityCard: {
    image(parent) {
      return '';
    },
  },
};

export default IdentityCardResolvers;
