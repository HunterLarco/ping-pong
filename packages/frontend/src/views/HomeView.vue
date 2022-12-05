<script setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';

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
      <div class="Button" :disabled="loading || undefined" @click="hostGame">
        Host Game
      </div>
      <div class="Button" :disabled="loading || undefined">Play in a Game</div>
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
  max-width: 250px;
  padding: 20px;
  width: 100%;
}

.Logo {
  padding-bottom: 40px;
}

.LogoImage {
  display: block;
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
  background: #2196f3;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  margin: 10px 0;
  padding: 10px 20px;
  text-align: center;
  user-select: none;

  &:hover {
    background: darken(#2196f3, 10%);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
