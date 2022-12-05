<script setup>
import { computed, nextTick } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { useRoute } from 'vue-router';
import cloneDeep from 'clone-deep';

import MenuButtonList from '@/components/MenuButtonList.vue';
import MenuButton from '@/components/MenuButton.vue';

import toaster from '@/toaster';

import concedeDocument from '@/graphql/concede';
import getGameByIdDocument from '@/graphql/getGameById';
import joinGameDocument from '@/graphql/joinGame';
import meDocument from '@/graphql/me';
import spectateDocument from '@/graphql/spectate';
import unveilDocument from '@/graphql/unveil';

const route = useRoute();

const { result, subscribeToMore, onResult } = useQuery(
  getGameByIdDocument,
  () => ({
    gameId: route.params.gameId,
  })
);

onResult(() => {
  nextTick(() => {
    if (!myPlayer.value) {
      const { mutate, onError } = useMutation(joinGameDocument);

      onError((error) => {
        toaster.error(error.message);
      });

      mutate({ request: { gameId: route.params.gameId } });
    }
  });
});

subscribeToMore(() => ({
  document: spectateDocument,
  variables: {
    request: {
      gameId: route.params.gameId,
    },
  },
  updateQuery(previousState, { subscriptionData: { data } }) {
    const { type, details } = data.spectate;
    const nextState = cloneDeep(previousState);
    switch (type) {
      case 'PlayerJoin':
        nextState.game.players.push(details.player);
        break;
      case 'GameStart':
        nextState.game = details.game;
        break;
      case 'PlayerUpdate':
        nextState.game.players = nextState.game.players.map((player) =>
          player.user.id == details.player.user.id ? details.player : player
        );
        break;
      case 'GameEnd':
        nextState.game = details.game;
        break;
      default:
        console.warn(`Unknown game event type ${type}.`);
    }
    return nextState;
  },
}));

const { result: meResult } = useQuery(meDocument);
const me = computed(() => meResult.value?.me ?? null);
const players = computed(() => {
  const game = result.value?.game ?? {};
  return game.players ?? [];
});
const myPlayer = computed(() => {
  return players.value.find((player) => player.user.id == me.value.id);
});

const canUnveil = computed(() => {
  if (!myPlayer.value) {
    return false;
  }
  return myPlayer.value.state == 'Active' && !myPlayer.value.unveiled;
});

const canConcede = computed(() => {
  if (!myPlayer.value) {
    return false;
  }
  return myPlayer.value.state == 'Active';
});

function unveil() {
  const { mutate } = useMutation(unveilDocument);
  mutate({ gameId: route.params.gameId });
}

function concede() {
  const { mutate } = useMutation(concedeDocument);
  mutate({ gameId: route.params.gameId });
}
</script>

<template>
  <div>
    <template v-if="!result?.game?.dateStarted">
      Waiting for game to start.
    </template>
    <template v-else>
      <MenuButtonList class="Buttons">
        <MenuButton :disabled="!canUnveil" @click="unveil()" text="Unveil" />
        <MenuButton :disabled="!canConcede" @click="concede()" text="Concede" />
      </MenuButtonList>
      <img :src="myPlayer?.identity.image" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.Buttons {
  margin: 10px;
}
</style>
