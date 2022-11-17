import BooksDataSource from '@/data_sources/BooksDataSource';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource';

export function createContext() {
  return {
    dataSources: {
      Books: new BooksDataSource(),
      Libraries: new LibrariesDataSource(),
    },
  };
}
