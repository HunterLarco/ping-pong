<script setup lang="ts">
import { RouterLink } from 'vue-router';

import MenuButton from '@/components/MenuButton.vue';
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <div class="Logo">
        <img class="LogoImage" src="@/assets/TreacheryLogo.png" />
        <div class="LogoText">MTG Treachery</div>
      </div>
    </div>
    <div class="Content"></div>
    <div class="Footer">
      <div class="Form">
        <RouterLink to="/login"><MenuButton text="Log In" /></RouterLink>
        <div class="SecondaryActions">
          <RouterLink to="/signup">Sign Up</RouterLink>
          or
          <span>Continue as Guest</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-vertical;

  position: fixed;
  background-image: linear-gradient(127deg, #76268a 0%, #1b1c80 100%);
}

.Header {
  flex-shrink: 0;
}

.Content {
  flex-grow: 1;
}

.Footer {
  flex-shrink: 0;
}

.Logo {
  padding: 40px 20px 20px 20px;
}

.LogoImage {
  display: block;
  height: 149px;
  margin: 0 auto;
  max-width: 149px;
  width: 100%;
}

.LogoText {
  font-size: 30px;
  font-weight: 700;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.Form {
  margin: 0 auto;
  max-width: 286px;
  padding: 20px 20px 60px 20px;
  width: 100%;
}

.SecondaryActions {
  color: rgba(#fff, 0.7);
  font-size: 12px;
  margin-top: 20px;
  text-align: center;
  white-space: nowrap;

  a,
  span {
    color: #fff;
  }
}
</style>
