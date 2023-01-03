<script setup lang="ts">
import { useRouter } from 'vue-router';

import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();

/// Actions

function logout() {
  window.localStorage.removeItem('authorization');
  router.push({ path: '/' });
}

function startGame() {
  router.push({ path: '/start' });
}
</script>

<template>
  <div class="HomePage">
    <NavBar title="MTG Treachery" no-back-button />
    <MenuButton text="Start a Game" @click="startGame" />
    <MenuButton text="Logout" @click="logout" />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
