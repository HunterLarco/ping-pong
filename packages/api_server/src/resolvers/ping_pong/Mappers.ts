import { Resolvers } from '@generated/graphql/ping_pong_service/resolvers';

export const resolvers: Resolvers = {
  MessageLog: {
    id(parent) {
      return parent.id;
    },
    payload(parent) {
      return parent.message;
    },
    dateReceived(parent) {
      return parent.dateCreated;
    },
  },
};
