import fetch from 'node-fetch';

const kDuration_Day = 24 * 60 * 60 * 1000;

async function fetchIdentities() {
  const { cards } = await fetch(
    'https://mtgtreachery.net/rules/oracle/treachery-cards.json'
  ).then((response) => response.json());
  return cards;
}

class IdentityDataSource {
  constructor() {
    this._lastFetch = null;
    this._identities = null;
  }

  async getIdentities() {
    if (!this._identities) {
      this._identities = fetchIdentities();
      this._lastFetch = Date.now();
    } else if (Date.now() - this._lastFetch > kDuration_Day) {
      try {
        this._identities = fetchIdentities();
        this._lastFetch = Date.now();
      } catch (error) {
        console.error('Failed to refresh data source with error:', error);
      }
    }

    return this._identities;
  }
}

export default new IdentityDataSource();
