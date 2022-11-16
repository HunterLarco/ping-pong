<script setup>
import { watch } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const kGetBooksQuery = gql`
  query Query {
    books {
      author
      title
      normalizedTitle
    }
  }
`;

const { result, refetch } = useQuery(kGetBooksQuery);

const { mutate: addBook } = useMutation(
  gql`
    mutation AddBook($title: String!, $author: String!) {
      addBook(title: $title, author: $author, branch: "NYPL") {
        code
        success
        message
        book {
          title
          author
          normalizedTitle
        }
      }
    }
  `,
  {
    update(cache, { data }) {
      if (!data.addBook.success) {
        return;
      }

      const cachedData = cache.readQuery({ query: kGetBooksQuery });
      cache.writeQuery({
        query: kGetBooksQuery,
        data: {
          books: [...cachedData.books, data.addBook.book],
        },
      });
    },
  }
);

const { onResult: onBookAdded } = useSubscription(gql`
  subscription BookAdded {
    bookAdded {
      title
    }
  }
`);

onBookAdded((data) => {
  console.log(data);
});
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
