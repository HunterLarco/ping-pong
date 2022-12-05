import { PubSub } from 'graphql-subscriptions';

import { ResolversTypes } from '@generated/graphql/game_service/resolvers';

type GameEvent = ResolversTypes['GameEvent'];

const inMemoryPubSub = new PubSub();

/**
 * In-memory pubsub mechanism for game events.
 */
export default class GameEventPubSub {
  publish(gameId: string, event: GameEvent) {
    inMemoryPubSub.publish(gameId, { event });
  }

  async *subscribe(gameId: string): AsyncIterableIterator<GameEvent> {
    // @ts-expect-error TS2504
    for await (const { event } of inMemoryPubSub.asyncIterator(gameId)) {
      yield event;
    }
  }
}
