import DataLoader from 'dataloader';
import FuzzySearch from 'fuzzy-search';
import { v4 as uuidv4 } from 'uuid';

// In-memory data

type BookDocument = {
  id: string;
  title: string;
  author: string;
  branch: string;
};

const books: Array<BookDocument> = [
  {
    id: uuidv4(),
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'ABRHS',
  },
  {
    id: uuidv4(),
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'NYPL',
  },
];

// Data source

export default class BooksDataSource {
  batchQueryByBranch = new DataLoader(async (branches: Array<string>) => {
    const results = new Map<string, Array<BookDocument>>();
    for (const branch of branches) {
      results.set(branch, []);
    }

    for (const book of books) {
      if (results.has(book.branch)) {
        results.get(book.branch).push(book);
      }
    }

    return branches.map((branch) => results.get(branch));
  });

  async queryByBranch(branch: string) {
    return this.batchQueryByBranch.load(branch);
  }

  async fuzzySearch(options: {
    title: string;
    author: string;
    branch: string;
  }): Promise<Array<BookDocument>> {
    const { title, author, branch } = options;

    let index;
    let results: Array<BookDocument> = books;

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

  async insert(options: {
    title: string;
    author: string;
    branch: string;
  }): Promise<BookDocument> {
    const { title, author, branch } = options;

    const book: BookDocument = { id: uuidv4(), title, author, branch };
    books.push(book);
    return book;
  }
}
