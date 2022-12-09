import { IdentityCard, IdentityType } from '@prisma/client';
import ExpiryMap from 'expiry-map';
import FuzzySearch from 'fuzzy-search';
import { GraphQLError } from 'graphql';
import fetch from 'node-fetch';
import pMemoize from 'p-memoize';
import { z } from 'zod';

// Data fetching utilities

const kDuration_Day = 24 * 60 * 60 * 1000;

const OracleCard = z.object({
  id: z.number(),
  name: z.string(),
  uri: z.string(),
  types: z.object({
    supertype: z.string(),
    subtype: z.string(),
  }),
  text: z.string(),
  rulings: z.array(z.string()),
});

const OracleResponse = z.object({
  cards: z.array(OracleCard),
});

function convertIdentityType(typeString: string): IdentityType {
  switch (typeString.toLowerCase()) {
    case 'leader':
      return IdentityType.Leader;
    case 'guardian':
      return IdentityType.Guardian;
    case 'assassin':
      return IdentityType.Assassin;
    case 'traitor':
      return IdentityType.Traitor;
  }
  throw new GraphQLError(`Unknown identity type '${typeString}'`);
}

const fetchOracleData = pMemoize(
  async (): Promise<Array<IdentityCard>> => {
    const { cards } = await fetch(
      'https://mtgtreachery.net/rules/oracle/treachery-cards.json'
    ).then(async (response) => OracleResponse.parse(await response.json()));

    // We convert the oracle representation to match our Prisma representation
    // so that we maintain parity between cards stored in the db and cards
    // pulled fresh from mtgtreachery.net.
    return cards.map((card) => ({
      id: card.id.toString(16),
      name: card.name,
      type: convertIdentityType(card.types.subtype),
      text: card.text.replace(/\|/g, '\n'),
      rulings: card.rulings,
      source: card.uri,
    }));
  },
  { cache: new ExpiryMap(kDuration_Day) }
);

// Data source abstraction

export type FuzzySearchFilters = {
  name: string | null;
};

export default class MTGTreacheryDataSource {
  async fuzzySearch(filters: FuzzySearchFilters): Promise<Array<IdentityCard>> {
    if (!filters.name) {
      return this.fetchAll();
    }

    return new FuzzySearch(await fetchOracleData(), ['name']).search(
      filters.name
    );
  }

  async fetchAll(): Promise<Array<IdentityCard>> {
    return fetchOracleData();
  }
}
