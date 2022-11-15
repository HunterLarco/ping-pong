<script setup>
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import TheWelcome from "../components/TheWelcome.vue";

const { result, refetch } = useQuery(gql`
  query Query {
    books {
      author
      title
      normalizedTitle
    }
  }
`);
</script>

<template>
  <main @click="refetch()">
    <TheWelcome />
    {{ result }}
  </main>
</template>
