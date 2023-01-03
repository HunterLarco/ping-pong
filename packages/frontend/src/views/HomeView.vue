<script setup lang="ts">
import { useRouter } from 'vue-router';

import MenuButton from '@/components/MenuButton.vue';

const router = useRouter();

function logout() {
  window.localStorage.removeItem('authorization');
  router.push({ path: '/' });
}
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <div class="Logo">
        <div class="LogoText">MTG Treachery</div>
      </div>
    </div>
    <div class="Content"></div>
    <div class="Footer">
      <MenuButton text="Logout" @click="logout" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-vertical;
}

.Header {
  flex-shrink: 0;
}

.Content {
  flex-grow: 1;
}

.Footer {
  flex-shrink: 0;
  padding: 10px 20px;
}

.Logo {
  padding: 40px 20px 20px 20px;
}

.LogoText {
  font-size: 30px;
  font-weight: 700;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
