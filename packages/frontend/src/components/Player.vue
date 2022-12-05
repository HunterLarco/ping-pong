<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// TODO: move color to the backend
const color = ref('#2196f3');

const healthTileStyles = computed(() => ({
  'background-color': color.value,
}));
</script>

<template>
  <div class="Player">
    <div class="HealthTile" :style="healthTileStyles">
      <div class="HealthText">40</div>
      <div class="Name">{{ data.user.name }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Player {
  height: 300px;
  overflow: hidden;
  user-select: none;
  width: 300px;
}

.HealthTile {
  @include layout-fill;
  @include layout-center;

  overflow: hidden;

  &::before {
    background: rgba(#000, 0.2);
    border-radius: 2px;
    content: '';
    display: block;
    height: 4px;
    left: 0;
    margin: 0 auto;
    mix-blend-mode: overlay;
    position: absolute;
    right: 0;
    top: 6px;
    width: 50px;
  }
}

.HealthText {
  color: rgb(#000, 0.9);
  font-size: 100px;
  font-weight: 700;
}

.Name {
  bottom: 0;
  color: rgb(#000, 0.2);
  font-size: 60px;
  left: 50%;
  line-height: 70px;
  mix-blend-mode: overlay;
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
}
</style>
