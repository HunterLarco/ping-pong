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
import type { StrictTypedTypePolicies } from '@generated/graphql/typedPolicies';
import { provideApolloClient } from '@vue/apollo-composable';
import { createClient } from 'graphql-ws';

import getGameByIdCachePolicy from '@/apollo/cache_policies/getGameById';

/// Create link

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${window.location.hostname}:4000/graphql`,
  })
);

const httpLink = new HttpLink({
  uri: `http://${window.location.hostname}:4000/graphql`,
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
  httpLink
);

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

/// Create cache

const cache = new InMemoryCache({
  typePolicies: <StrictTypedTypePolicies>{
    Query: {
      fields: {
        getGameById: getGameByIdCachePolicy,
      },
    },
  },
});

/// Construct the client

const apolloClient = new ApolloClient({
  cache,
  link: concat(authorization, link),
});

provideApolloClient(apolloClient);
