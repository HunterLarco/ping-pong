<script setup>
import { useQuery } from '@vue/apollo-composable';
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import gql from 'graphql-tag';
import cloneDeep from 'clone-deep';

import getGameByIdDocument from '@/graphql/getGameById';
import spectateDocument from '@/graphql/spectate';

import Player from '@/components/Player.vue';

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
  <div class="Host">
    <div class="PlayerGrid">
      <template v-if="result">
        <Player
          :data="player"
          v-for="player in result.game.players"
          :key="player.user.id"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  @include layout-fill;
}

.PlayerGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
}
</style>
