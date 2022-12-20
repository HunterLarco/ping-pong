<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="Frame" :disabled="disabled || undefined">
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

  &[disabled] {
    cursor: not-allowed;

    .Label {
      color: rgba(#fff, 0.2);
    }

    &::before {
      background: rgba(#fff, 0.4);
    }
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

:slotted(.Frame[disabled] .Content > *) {
  color: rgba(#fff, 0.4);
}

:slotted(.Content > input[type='text']),
:slotted(.Content > input[type='tel']),
:slotted(.Content > input[type='number']),
:slotted(.Content > select) {
  appearance: none;
  background: transparent;
  border-radius: 0;
  border: none;
  color: #fff;
  font-size: 16px;
  height: 100%;
  outline: none;
  padding: 0 6px;
  width: 100%;
}
</style>
