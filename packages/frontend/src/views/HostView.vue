<script setup lang="ts">
import { useMutation, useSubscription } from '@vue/apollo-composable';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import CreateGameGQL from '@/graphql/operations/CreateGame';
import SpectateGameGQL from '@/graphql/operations/SpectateGame';

const route = useRoute();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
  // If the page is `/host` then we need to create a new game. The
  // `useSubscription` directive below will automatically watch for changes in
  // the url so when we redirect to `/host/{gameId}`, the subscription will
  // start.
  if (!route.params.gameId) {
    const { mutate: createGame, onDone, onError } = useMutation(CreateGameGQL);

    onDone(({ data }) => {
      router.push({
        path: `/host/${data.createGame.game.id}`,
      });
    });

    onError((error) => {
      toast.error(error.message);
    });

    createGame();
  }
});

const { onResult: onGameEvent } = useSubscription(
  SpectateGameGQL,
  () => ({
    gameId: route.params.gameId,
  }),
  () => ({
    enabled: !!route.params.gameId,
  })
);

onGameEvent(({ data }) => {
  const { spectate: event } = data;
  console.log(event);
});
</script>

<template>
  <div class="HostPage">host</div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HostPage {
  @include layout-fill;
  @include layout-center;

  position: fixed;
}
</style>
