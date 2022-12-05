<script setup>
import { useQuery } from '@vue/apollo-composable';
import { useRouter, useRoute } from 'vue-router';
import gql from 'graphql-tag';
import cloneDeep from 'clone-deep';

import getGameByIdDocument from '@/graphql/getGameById';
import spectateDocument from '@/graphql/spectate';

import LoadingPlayersScreen from '@/components/LoadingPlayersScreen.vue';
import ActiveGameScreen from '@/components/ActiveGameScreen.vue';

const route = useRoute();
const router = useRouter();

const { result, subscribeToMore } = useQuery(getGameByIdDocument, () => ({
  gameId: route.params.gameId,
}));

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
</script>

<template>
  <div class="Screen">
    <template v-if="result">
      <LoadingPlayersScreen
        class="Screen"
        :game="result.game"
        v-if="!result.game.dateStarted"
      />
      <ActiveGameScreen class="Screen" :game="result.game" v-else />
    </template>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Screen {
  @include layout-fill;
}
</style>
