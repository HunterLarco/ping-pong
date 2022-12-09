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
.Button {
  background: #2196f3;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 20px;
  text-align: center;
  user-select: none;

  &:not([disabled]) {
    &:hover {
      background: darken(#2196f3, 10%);
    }
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
