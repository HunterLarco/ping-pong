<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  noBackButton: {
    type: Boolean,
    default: false,
  },
});

function goBack() {
  router.go(-1);
}
</script>

<template>
  <div class="Host">
    <div class="Left">
      <img v-if="!noBackButton" @click="goBack" src="@/assets/BackButton.svg" />
    </div>

    <div class="Center">
      {{ props.title }}
    </div>

    <div class="Right">
      <div v-if="!noBackButton" class="ButtonBalancer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  @include layout-horizontal;

  padding: 20px 23px 0 23px;
}

.Left {
  flex-shrink: 0;

  img {
    vertical-align: middle;
  }
}

.Center {
  flex-grow: 1;
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.Right {
  flex-shrink: 0;
}

.ButtonBalancer {
  width: 22px;
}
</style>
