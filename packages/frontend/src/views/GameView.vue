<script setup>
import { ref } from 'vue';

import Tile from '@/components/Tile.vue';
</script>

<template>
  <div class="Page">
    <Tile class="Me" foreground-background="#2196f3"> </Tile>
    <div class="Players">
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Page {
  @include layout-fill;
  @include layout-vertical;
}

.Me {
  flex-grow: 1;
}

.Players {
  background: gray;
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

  & > div {
    background: #fff;
    height: 100px;
  }
}
</style>
