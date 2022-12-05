<script setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';

import MenuButton from '@/components/MenuButton.vue';

const router = useRouter();
const loading = ref(false);

function hostGame() {
  if (loading.value) {
    return;
  }

  const { mutate, onDone, onError } = useMutation(
    gql`
      mutation CreateGame {
        createGame {
          game {
            id
          }
        }
      }
    `
  );

  onDone(({ data }) => {
    loading.value = false;
    router.push({ path: `/host/${data.createGame.game.id}` });
  });

  onError((error) => {
    loading.value = false;
    console.error('Failed to create game.'.error);
  });

  mutate();
}
</script>

<template>
  <div class="HomePage">
    <div class="Frame">
      <div class="Logo">
        <img class="LogoImage" src="@/assets/TreacheryLogo.png" />
        <div class="LogoText">MTG Treachery</div>
      </div>
      <MenuButton :disabled="loading" text="Host Game" @click="hostGame()" />
      <MenuButton :disabled="loading" text="Play in a Game" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-center;
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

.Button {
  margin: 10px 0;
}
</style>
