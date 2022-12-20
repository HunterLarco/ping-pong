<script setup lang="ts">
const props = defineProps({
  back: {
    type: String,
    default: '/',
  },

  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="Host">
    <div class="Left">
      <RouterLink :to="props.back">
        <img src="@/assets/BackButton.svg" />
      </RouterLink>
    </div>

    <div class="Center">
      {{ props.title }}
    </div>

    <div class="Right" />
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
  width: 22px;
}
</style>
