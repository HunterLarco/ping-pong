<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable';
import cloneDeep from 'clone-deep';
import { onMounted, watch } from 'vue';
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

const { result: gameResult, subscribeToMore: spectate } = useQuery(
  GetGameGQL,
  () => ({
    gameId: route.params.gameId,
  }),
  {
    fetchPolicy: 'cache-only',
  }
);

// If the path contains a game ID, create a subscription to update the above
// cache-only query.
watch(
  () => <string>route.params.gameId,
  (gameId: string) => {
    if (!gameId) {
      return;
    }

    spectate(() => ({
      document: SpectateGameGQL,
      variables: { gameId },
      updateQuery(cacheEntry, { subscriptionData }) {
        return {
          game: applyGameEvent(cacheEntry.game, subscriptionData.data.spectate),
        };
      },
      onError(error) {
        toast.error(error.message);
        console.log(error);
      },
    }));
  },
  {
    immediate: true,
  }
);

function applyGameEvent(game: any, event: any) {
  switch (event.type) {
    case 'PlayerJoin': {
      const tmp = cloneDeep(game);
      tmp.players.push(event.details.player);
      return tmp;
    }
    case 'PlayerUpdate': {
      const tmp = cloneDeep(game);
      tmp.players = tmp.players.map((player: any) =>
        player.user.id == event.details.player.user.id
          ? event.details.player
          : player
      );
      return tmp;
    }
  }
}
</script>

<template>
  <div class="HostPage">{{ gameResult }}</div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HostPage {
  @include layout-fill;
  @include layout-center;

  position: fixed;
}
</style>
