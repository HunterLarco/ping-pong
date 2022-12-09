<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import MenuButton from '@/components/MenuButton.vue';
import MenuButtonList from '@/components/MenuButtonList.vue';
import HomePageGQL from '@/graphql/operations/HomePage';

const router = useRouter();

const { result: homePageResult } = useQuery(HomePageGQL);

function hostGame() {
  router.push({ path: `/host` });
}

function joinCurrentGame() {
  router.push({ path: `/host/${homePageResult.value.viewer.currentGame.id}` });
}
</script>

<template>
  <div class="HomePage">
    <div class="Frame">
      <div class="Logo">
        <img class="LogoImage" src="@/assets/TreacheryLogo.png" />
        <div class="LogoText">MTG Treachery</div>
      </div>
      <MenuButtonList>
        <MenuButton text="Host Game" @click="hostGame()" />
        <MenuButton
          :disabled="!homePageResult?.viewer?.currentGame"
          text="Join Current Game"
          @click="joinCurrentGame()"
        />
      </MenuButtonList>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-center;

  position: fixed;
}

.Frame {
  margin-bottom: 40px;
  max-width: 250px;
  padding: 20px;
  width: 100%;
}

.Logo {
  padding-bottom: 40px;
}

.LogoImage {
  display: block;
  height: 150px;
  margin: 0 auto;
  max-width: 150px;
  width: 100%;
}

.LogoText {
  font-size: 28px;
  font-weight: 700;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}
</style>
