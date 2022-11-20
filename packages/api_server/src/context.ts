import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';

export type RequestContext = any;

export function createContext() {
  return {
    dataSources: {
      MTGTreachery: new MTGTreacheryDataSource(),
    },
  };
}
