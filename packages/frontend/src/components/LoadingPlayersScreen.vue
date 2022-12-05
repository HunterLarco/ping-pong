<script setup>
import { computed } from 'vue';
import { useMutation } from '@vue/apollo-composable';

import QrcodeVue from 'qrcode.vue';

import startGameDocument from '@/graphql/startGame';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const joinUrl = computed(() => {
  const url = new URL(window.location.origin);
  url.pathname = `/join/${props.game.id}`;
  return url.toString();
});

const { mutate: startGame } = useMutation(startGameDocument);
</script>

<template>
  <div class="Host">
    <div class="Frame">
      <div class="Qrcode">
        <QrcodeVue :value="joinUrl" :size="200" />
      </div>
      <div class="Players">
        <div
          class="Player"
          v-for="player of game.players"
          :key="player.user.id"
        >
          {{ player.user.name }}
        </div>
        <button
          @click="startGame({ request: { gameId: game.id } })"
          v-show="game.players.length >= 4"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  @include layout-center;
}

.Frame {
  @include layout-horizontal;

  width: 100%;
  max-width: 600px;
}

.Qrcode {
  flex-shrink: 0;
}

.Players {
  flex-grow: 1;
  padding-left: 20px;
}

.Player {
  font-size: 18px;
  padding: 4px;
}
</style>
