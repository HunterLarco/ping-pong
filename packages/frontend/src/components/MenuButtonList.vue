<script setup lang="ts">
// TODO: https://github.com/trivago/prettier-plugin-sort-imports/issues/191
</script>

<template>
  <div class="ButtonList">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
:slotted(.ButtonList > *) {
  margin: 10px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
