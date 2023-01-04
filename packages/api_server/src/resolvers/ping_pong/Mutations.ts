import type { MutationResolvers } from '@generated/graphql/ping_pong_service/resolvers';
import { GraphQLError } from 'graphql';

export const resolvers: MutationResolvers = {
  async sendMessage(_0, { request }, { dataSources }) {
    const messageLog = await dataSources.MessageHistory.recordMessage({
      message: request.message,
    });

    dataSources.MessageLogPubSub.publish(messageLog);

    if (request.message.toLowerCase() !== 'ping') {
      throw new GraphQLError('Message must be `ping`.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    return {
      response: 'pong',
    };
  },
};
