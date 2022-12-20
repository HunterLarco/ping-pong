<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="Frame">
    <div class="Label">{{ props.label }}</div>
    <div class="Content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Frame {
  border-radius: 6px;
  color: #fff;
  overflow: hidden;
  padding: 17px 0 0 0;
  position: relative;
  user-select: none;

  &::before {
    @include layout-fill;

    background: #fff;
    content: '';
    display: block;
    mix-blend-mode: overlay;
    z-index: -1;
  }
}

.Label {
  color: rgba(#fff, 0.5);
  font-size: 9px;
  font-weight: 700;
  left: 6px;
  line-height: 11px;
  position: absolute;
  top: 6px;
}

.Content {
  height: 36px;
}
</style>
