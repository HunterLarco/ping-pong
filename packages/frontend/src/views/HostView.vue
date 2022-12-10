<script setup lang="ts">
import {
  useCreateGameMutation,
  useGetGameQuery,
  useSpectateGameSubscription,
} from '@generated/graphql/operations';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import * as GameFragmentCache from '@/apollo/cache_updates/GameFragment';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// If the page is `/host` then we need to create a new game. The
// `useSubscription` directive below will automatically watch for changes in
// the url so when we redirect to `/host/{gameId}`, the subscription will
// start.
watch(
  () => route.params.gameId,
  (gameId) => {
    if (!gameId) {
      const { mutate: createGame, onDone, onError } = useCreateGameMutation();

      onDone(({ data }) => {
        router.push({
          path: `/host/${data!.createGame.game.id}`,
        });
      });

      onError((error) => {
        toast.error(error.message);
        console.error('Failed to create game.', error);
      });

      createGame();
    }
  },
  {
    immediate: true,
  }
);

const { result: gameResult } = useGetGameQuery(
  () => ({
    gameId: <string>route.params.gameId,
  }),
  {
    fetchPolicy: 'cache-only',
  }
);

const { onResult: onGameEvent, onError: onSpectateError } =
  useSpectateGameSubscription(
    () => ({
      gameId: <string>route.params.gameId,
    }),
    () => ({
      enabled: !!route.params.gameId,
    })
  );

onGameEvent(({ data }) => {
  const event = data?.spectate;
  if (!event) {
    return;
  }

  const details = event.details;
  switch (details.__typename) {
    case 'PlayerJoinEvent': {
      GameFragmentCache.update(<string>route.params.gameId, (game) => {
        game.players.push(details.player);
        if (details.player.user.isViewer) {
          game.viewerIsParticipant = true;
        }
        return game;
      });
      break;
    }
    case 'PlayerUpdateEvent': {
      GameFragmentCache.update(<string>route.params.gameId, (game) => {
        game.players = game.players.map((player) =>
          player.user.id == details.player.user.id ? details.player : player
        );
        return game;
      });
      break;
    }
  }
});

onSpectateError((error) => {
  toast.error(error.message);
  console.error('Failed to spectate game.', error);
});
</script>

<template>
  <div class="HostPage">
    <pre>{{ JSON.stringify(gameResult, null, 2) }}</pre>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HostPage {
  @include layout-fill;

  position: fixed;
  overflow: scroll;
}
</style>
