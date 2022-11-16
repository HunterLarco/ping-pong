import BooksDataSource from '@/data_sources/BooksDataSource.js';
import RoomEventsDataSource from '@/data_sources/RoomEventsDataSource.js';
import LibrariesDataSource from '@/data_sources/LibrariesDataSource.js';
import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource.js';

export function createContext() {
  return {
    dataSources: {
      Books: new BooksDataSource(),
      Libraries: new LibrariesDataSource(),
      MTGTreachery: MTGTreacheryDataSource,
      RoomEvents: new RoomEventsDataSource(),
    },
  };
}
