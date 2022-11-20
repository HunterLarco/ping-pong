import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';
import fetch from 'node-fetch';
import FuzzySearch from 'fuzzy-search';
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

const fetchOracleData = pMemoize(
  async () => {
    const response = await fetch(
      'https://mtgtreachery.net/rules/oracle/treachery-cards.json'
    ).then(async (response) => OracleResponse.parse(await response.json()));
    return response.cards;
  },
  { cache: new ExpiryMap(kDuration_Day) }
);

// Data source abstraction

export type OracleCard = z.infer<typeof OracleCard>;

export default class MTGTreacheryDataSource {
  async fuzzySearch(options: { name: string }): Promise<Array<OracleCard>> {
    return [];
  }

  async fetchAll(): Promise<Array<OracleCard>> {
    return fetchOracleData();
  }
}
