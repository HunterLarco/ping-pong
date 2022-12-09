<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import CreateGameGQL from '@/graphql/operations/CreateGame';
import GetGameGQL from '@/graphql/operations/GetGame';
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
      console.error('Failed to create game.', error);
    });

    createGame();
  }
});

const { result: cachedGameResult } = useQuery(
  GetGameGQL,
  () => ({
    gameId: route.params.gameId,
  }),
  {
    fetchPolicy: 'cache-only',
  }
);

const { onResult: onGameEvent, onError: onSpectateError } = useSubscription(
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

onSpectateError((error) => {
  toast.error(error.message);
  console.error('Failed to spectate game.', error);
});
</script>

<template>
  <div class="HostPage">{{ cachedGameResult }}</div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HostPage {
  @include layout-fill;
  @include layout-center;

  position: fixed;
}
</style>
