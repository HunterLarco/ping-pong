import FuzzySearch from 'fuzzy-search';

// In-memory data

const libraries = [{ branch: 'ABRHS' }, { branch: 'NYPL' }];

const fuzzyBranchIndex = new FuzzySearch(libraries, ['branch']);

// Data source

export default class LibrariesDataSource {
  async fuzzySearch({ branch }) {
    return fuzzyBranchIndex.search(branch);
  }

  async loadAll() {
    return libraries;
  }
}
