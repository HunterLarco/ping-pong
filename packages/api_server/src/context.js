import BooksDataSource from '@/data_sources/BooksDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';
import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource.js';

export function createContext() {
  return {
    dataSources: {
      Books: new BooksDataSource(),
      Libraries: new LibrariesDataSource(),
      MTGTreachery: MTGTreacheryDataSource,
    },
  };
}
