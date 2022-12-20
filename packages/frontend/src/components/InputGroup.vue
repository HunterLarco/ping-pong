<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div>
    <div class="Label">{{ props.label }}</div>
    <div class="Fields">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Label {
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  padding-bottom: 20px;
}

:slotted(.Fields > *) {
  border-radius: 0;
  margin: 2px 0;

  &:first-child {
    border-radius: 6px 6px 0 0;
    margin-top: 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
    margin-bottom: 0;
  }
}
</style>
