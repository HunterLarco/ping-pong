import DataLoader from 'dataloader';
import FuzzySearch from 'fuzzy-search';
import { v4 as uuidv4 } from 'uuid';

// In-memory data

const roomEvents = [];
const textIndex = new FuzzySearch(roomEvents, ['text']);

// Data source

export default class RoomEventsDataSource {
  async queryBeforeDate(beforeDate) {
    return roomEvents.filter((event) => event.timestamp < beforeDate);
  }

  async fuzzySearch({ text }) {
    return textIndex.search(text);
  }

  async insert(document) {
    const event = { id: uuidv4(), ...document };
    roomEvents.push(event);
    return event;
  }
}
