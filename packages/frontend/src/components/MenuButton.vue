<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

function tryEmitClick() {
  if (!props.disabled) {
    emit('click');
  }
}
</script>

<template>
  <div class="Button" :disabled="disabled || undefined" @click="tryEmitClick">
    {{ text }}
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Button {
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  position: relative;
  text-align: center;
  user-select: none;

  &::before {
    @include layout-fill;

    background: #fff;
    border-radius: 6px;
    content: '';
    display: block;
    mix-blend-mode: overlay;
    z-index: -1;
  }

  &[disabled] {
    color: rgba(#fff, 0.4);
    cursor: not-allowed;

    &::before {
      background: rgba(#fff, 0.4);
    }
  }
}
</style>
