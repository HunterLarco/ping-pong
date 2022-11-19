import FuzzySearch from 'fuzzy-search';

// In-memory data

type LibraryDocument = {
  branch: string;
};

const libraries: Array<LibraryDocument> = [
  { branch: 'ABRHS' },
  { branch: 'NYPL' },
];

const fuzzyBranchIndex = new FuzzySearch(libraries, ['branch']);

// Data source

export default class LibrariesDataSource {
  async fuzzySearch(options: {
    branch: string;
  }): Promise<Array<LibraryDocument>> {
    return fuzzyBranchIndex.search(options.branch);
  }

  async loadAll(): Promise<Array<LibraryDocument>> {
    return libraries;
  }
}
