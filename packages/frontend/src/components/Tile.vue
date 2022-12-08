<script setup>
import { ref, computed } from 'vue';

import { useDrag } from '@/interactions/drag';

const props = defineProps({
  foregroundColor: {
    type: String,
    default: 'currentcolor',
  },

  foregroundBackground: {
    type: String,
    default: '#FFF',
  },
});

const host = ref(null);
const { deltaY, velocityY, isDragActive, onDragEnd } = useDrag(host);
const open = ref(false);

onDragEnd(({ deltaY, velocityY }) => {
  if (open.value) {
    open.value = velocityY > -0.5 && deltaY / host.value?.offsetHeight > -0.5;
  } else {
    open.value = velocityY > 0.5 || deltaY / host.value?.offsetHeight > 0.5;
  }
});

const foregroundStyles = computed(() => {
  const offsetFromTop = isDragActive.value
    ? deltaY.value / host.value?.offsetHeight
    : 0;
  const offset = Math.min(
    Math.max(open.value ? 1 + offsetFromTop : offsetFromTop, 0),
    1
  );
  const offsetWithPadding = (host.value?.offsetHeight - 18) * offset;

  return {
    color: props.foregroundColor,
    'background-color': props.foregroundBackground,
    top: `${offsetWithPadding}px`,
    transition: isDragActive.value ? '' : 'top 250ms ease',
  };
});
</script>

<template>
  <div class="Host" @mousedown="onMouseDown" ref="host">
    <slot></slot>

    <div class="Foreground" :style="foregroundStyles">
      <slot name="foreground"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  overflow: hidden;
  position: relative;
  user-select: none;
}

.Foreground {
  @include layout-fill;

  overflow: hidden;

  &::before {
    background: rgba(#000, 0.2);
    border-radius: 2px;
    content: '';
    display: block;
    height: 4px;
    left: 0;
    margin: 0 auto;
    position: absolute;
    right: 0;
    top: 6px;
    width: 50px;
  }
}
</style>
