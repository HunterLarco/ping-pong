<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';

import QrcodeVue from 'qrcode.vue';
import MenuButton from '@/components/MenuButton.vue';

import startGameDocument from '@/graphql/startGame';
import toaster from '@/toaster';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const joinUrl = computed(() => {
  const url = new URL(window.location.origin);
  url.pathname = `/join/${props.game.id}`;
  return url.toString();
});

function startGame() {
  const { mutate, onError } = useMutation(startGameDocument, {
    variables: {
      request: {
        gameId: props.game.id,
      },
    },
  });

  mutate();

  onError((error) => {
    toaster.error(error.message);
  });
}

function cancelGame() {
  router.push({ path: '/' });
}
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
          <MenuButton text="Start Game" @click="startGame()" :disabled="game.players.length < 4" />
        <MenuButton text="Cancel Game" @click="cancelGame()" />
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
