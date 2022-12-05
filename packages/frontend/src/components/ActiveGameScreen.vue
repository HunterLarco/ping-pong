<script setup>
import Player from '@/components/Player.vue';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="PlayerGrid">
      <Player
        :data="player"
        v-for="player in game.players"
        :key="player.user.id"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.PlayerGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
}
</style>
