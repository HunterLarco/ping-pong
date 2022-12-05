<script setup>
import { watch } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const kGetMe = gql`
  query Query {
    me {
      id
      name
      currentGame {
        id
      }
    }
  }
`;

const { result, refetch } = useQuery(kGetMe);

const { mutate: addBook } = useMutation(
  gql`
    mutation AddBook($title: String!, $author: String!) {
      addBook(title: $title, author: $author, branch: "NYPL") {
        code
        success
        message
        book {
          id
          title
          author
          normalizedTitle
        }
      }
    }
  `
);
</script>

<template>
  <div>
    <div style="white-space: pre">{{ JSON.stringify(result, null, 2) }}</div>
    <button @click="addBook({ title: Date.now().toString(), author: 'me' })">
      Add Book
    </button>
    <button @click="refetch()">Refresh</button>
  </div>
</template>
