import { ResolversTypes } from '@generated/graphql/ping_pong_service/resolvers';
import { PubSub } from 'graphql-subscriptions';

type MessageLog = ResolversTypes['MessageLog'];

const inMemoryPubSub = new PubSub();

/**
 * In-memory pubsub mechanism for game events.
 */
export default class MessageLogPubSub {
  publish(event: MessageLog) {
    inMemoryPubSub.publish('global', { event });
  }

  async *subscribe(): AsyncIterableIterator<MessageLog> {
    // @ts-expect-error TS2504
    for await (const { event } of inMemoryPubSub.asyncIterator('global')) {
      yield event;
    }
  }
}
