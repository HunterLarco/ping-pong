<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CreateGameGQL from '@/graphql/operations/CreateGame';

const route = useRoute();
const router = useRouter();

const { mutate: createGameMutation } = useMutation(CreateGameGQL);

onMounted(async () => {
  if (!route.params.gameId) {
    // TODO: fix this
    // @ts-ignore
    const { data } = await createGameMutation();
    router.push({
      path: `/host/${data.createGame.game.id}`,
    });
  }
});
</script>

<template>
  <div class="HostPage">host</div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HostPage {
  @include layout-fill;
  @include layout-center;

  position: fixed;
}
</style>
