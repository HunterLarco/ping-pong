import {
  HttpLink,
  split,
  concat,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { provideApolloClient } from '@vue/apollo-composable';

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
  typePolicies: {
    Query: {
      fields: {
        getGameById: {
          read(_, { args, toReference }) {
            if (!args) {
              return null;
            }
            return toReference({
              __typename: 'Game',
              id: args.id,
            });
          },
        },
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
