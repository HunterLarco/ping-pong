import DataLoader from 'dataloader';
import FuzzySearch from 'fuzzy-search';

// In-memory data

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'ABRHS',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'NYPL',
  },
];

// Data source

export default class BooksDataSource {
  batchQueryByBranch = new DataLoader(async (branches) => {
    const results = {};
    for (const branch of branches) {
      results[branch] = [];
    }

    for (const book of books) {
      if (!!results[book.branch]) {
        results[book.branch].push(book);
      }
    }

    return branches.map((branch) => results[branch]);
  });

  async queryByBranch(branch) {
    return this.batchQueryByBranch.load(branch);
  }

  async fuzzySearch({ title, author, branch }) {
    let index;
    let results = books;

    if (title) {
      index = new FuzzySearch(results, ['title']);
      results = index.search(title);
    }

    if (author) {
      index = new FuzzySearch(results, ['author']);
      results = index.search(author);
    }

    if (branch) {
      index = new FuzzySearch(results, ['branch']);
      results = index.search(branch);
    }

    return results;
  }

  async loadAll() {
    return books;
  }

  async insert({ title, author, branch }) {
    const book = { title, author, branch };
    books.push(book);
    return book;
  }
}
