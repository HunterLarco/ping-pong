import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  concat,
  split,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { provideApolloClient } from '@vue/apollo-composable';
import { createClient } from 'graphql-ws';

/// Create link

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${window.location.hostname}:4000/graphql`,
    // Unbelievably, web sockers cannot include custom headers in browsers (see
    // linked source below). This means that we need to send our authorization
    // token directly as part of the initial connection request instead of using
    // the `authorization` ApolloLink which is used with `httpLink`.
    //
    // https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api/4361358#4361358
    connectionParams: () => ({
      Authorization: localStorage.getItem('authorization') ?? undefined,
    }),
  })
);

const httpLink = new HttpLink({
  uri: `http://${window.location.hostname}:4000/graphql`,
});

const authorization = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authorization');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: token,
      },
    });
  }
  return forward(operation);
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  concat(authorization, httpLink)
);

/// Create cache

const cache = new InMemoryCache();

/// Construct the client

const apolloClient = new ApolloClient({
  cache,
  link,
});

provideApolloClient(apolloClient);
