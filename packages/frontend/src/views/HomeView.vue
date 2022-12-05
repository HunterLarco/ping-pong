<script setup>
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';

const router = useRouter();

const { mutate: createGame, onDone } = useMutation(
  gql`
    mutation CreateGame {
      createGame {
        game {
          id
        }
      }
    }
  `
);

onDone(({ data }) => {
  router.push({ path: `/host/${data.createGame.game.id}` });
});
</script>

<template>
  <div>
    <button @click="createGame()">Create Game</button>
  </div>
</template>
