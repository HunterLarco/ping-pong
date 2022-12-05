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

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
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

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authorization, link),
});

provideApolloClient(apolloClient);
