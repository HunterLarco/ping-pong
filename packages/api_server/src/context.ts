import BooksDataSource from '@/data_sources/BooksDataSource';

export type RequestContext = any;

export function createContext() {
  return {
    dataSources: {
      Books: new BooksDataSource(),
    },
  };
}
