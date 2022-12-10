import type { FieldPolicy } from '@apollo/client/cache';

export default <FieldPolicy>{
  // This cache redirect causes `getGameById` queries to attempt to serve from
  // cache before querying the server.
  //
  // See https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects
  read(_, { args, toReference }) {
    if (!args) {
      return null;
    }
    return toReference({
      __typename: 'Game',
      id: args.id,
    });
  },
};
