<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="SafeArea">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.SafeArea {
  position: absolute;
  top: env(safe-area-inset-top);
  right: env(safe-area-inset-right);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
}
</style>
