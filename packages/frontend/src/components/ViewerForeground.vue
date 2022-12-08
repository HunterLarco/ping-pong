<script setup>
import { ref } from 'vue';

const health = ref(40);
</script>

<template>
  <div class="Host">
    <div class="HealthText">{{ health }}</div>
    <div class="HealthUp" @click="++health" />
    <div class="HealthDown" @click="--health" />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  @include layout-fill;
  @include layout-center;
}

.HealthText {
  color: rgb(#000, 0.9);
  font-size: 100px;
  font-weight: 700;
}

.HealthUp {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50%;
}

.HealthDown {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
}
</style>
