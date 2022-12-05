<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="App">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.App {
  @include layout-fill;

  position: fixed;
}
</style>
