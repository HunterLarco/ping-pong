<script setup>
import { watch } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const kGetBooksQuery = gql`
  query Query {
    books {
      id
      author
      title
      normalizedTitle
    }
  }
`;

const { result, refetch, subscribeToMore } = useQuery(kGetBooksQuery);

subscribeToMore({
  document: gql`
    subscription BookAdded {
      bookAdded {
        id
        title
        normalizedTitle
        author
      }
    }
  `,
  updateQuery(prev, { subscriptionData }) {
    if (!subscriptionData.data) {
      return prev;
    }

    for (const book of prev.books) {
      if (book.id == subscriptionData.data.bookAdded.id) {
        return prev;
      }
    }

    return {
      books: [...prev.books, subscriptionData.data.bookAdded],
    };
  },
});

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
  `,
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
