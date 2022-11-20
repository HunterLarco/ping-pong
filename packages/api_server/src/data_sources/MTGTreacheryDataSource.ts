import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';
import fetch from 'node-fetch';
import FuzzySearch from 'fuzzy-search';
import { z } from 'zod';

// Data fetching utilities

const kDuration_Day = 24 * 60 * 60 * 1000;

const OracleCard = z.object({
  title: z.string(),
});

const OracleResponse = z.object({
  cards: z.array(OracleCard),
});

const fetchOracleData = pMemoize(
  async () => {
    const response = await fetch(
      'https://mtgtreachery.net/rules/oracle/treachery-cards.json'
    ).then((response) => OracleResponse.parse(response.json()));
    return response.cards;
  },
  { cache: new ExpiryMap(kDuration_Day) }
);

// Data source abstraction

export type OracleCard = z.infer<typeof OracleCard>;

export default class MTGTreacheryDataSource {
  async fuzzySearch(options: { title: string }): Promise<Array<OracleCard>> {
    return [];
  }

  async fetchAll(): Promise<Array<OracleCard>> {
    return fetchOracleData();
  }
}
