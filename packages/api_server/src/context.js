import BooksDataSource from '@/data_sources/BooksDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';

export function createContext() {
  return {
    dataSources: {
      Books: new BooksDataSource(),
      Libraries: new LibrariesDataSource(),
    }
  };
}
